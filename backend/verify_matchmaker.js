import assert from 'assert';
import connectDB from './config/db.js';
import User from './models/User.js';
import Campaign from './models/Campaign.js';
import aiRouter from './routes/ai.js';

const runVerification = async () => {
  console.log('--- Starting Quantum AI Matchmaker Route Verification ---');
  
  try {
    await connectDB();

    // 1. Fetch a Brand user
    const brandUser = await User.findOne({ role: 'brand' });
    if (!brandUser) {
      throw new Error('No brand user found in database. Seed the database first.');
    }
    console.log(`Using Brand User: ${brandUser.name} (${brandUser.email})`);

    // 2. Fetch a Creator user
    const creatorUser = await User.findOne({ role: 'creator' });
    if (!creatorUser) {
      throw new Error('No creator user found in database. Seed the database first.');
    }
    console.log(`Using Creator User: ${creatorUser.name} (${creatorUser.email})`);

    // 3. Mock the Express request/response cycle for Brand
    const mockResBrand = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      }
    };

    const mockReqBrand = {
      user: brandUser,
      body: {}
    };

    // We fetch the route handler function from the express router layer
    // The router stack contains the middleware layers
    const matchRoute = aiRouter.stack.find(s => s.route && s.route.path === '/quantum-match');
    if (!matchRoute) {
      throw new Error('Route /quantum-match not registered on AI router.');
    }

    // Call the route handler for Brand
    // Middlewares are: protect (skipped here because we directly set req.user)
    const handler = matchRoute.route.stack[matchRoute.route.stack.length - 1].handle;
    await handler(mockReqBrand, mockResBrand);

    // Validate Brand Output
    assert.strictEqual(mockResBrand.statusCode, 200, 'Brand matching should succeed with status 200');
    assert.ok(mockResBrand.data, 'Should return data payload');
    assert.strictEqual(mockResBrand.data.role, 'brand', 'Role should be brand');
    assert.ok(Array.isArray(mockResBrand.data.matches), 'Matches should be an array');
    assert.strictEqual(mockResBrand.data.matches.length, 3, 'Should return exactly 3 matches');
    
    console.log('\n✔ Brand Match Results:');
    mockResBrand.data.matches.forEach((m, idx) => {
      console.log(`  [Match ${idx+1}] ${m.name} (@${m.username}) -> ${m.fitScore}%`);
      console.log(`    Reason: ${m.reason}`);
      assert.ok(m.id, 'Match must contain id');
      assert.ok(m.name, 'Match must contain name');
      assert.ok(m.fitScore, 'Match must contain fitScore');
      assert.ok(m.reason, 'Match must contain reason');
    });
    console.log('✔ Brand matching payload verified.');

    // 4. Mock request/response for Creator
    const mockResCreator = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.data = data;
        return this;
      }
    };

    const mockReqCreator = {
      user: creatorUser,
      body: {}
    };

    // Call the route handler for Creator
    await handler(mockReqCreator, mockResCreator);

    // Validate Creator Output
    assert.strictEqual(mockResCreator.statusCode, 200, 'Creator matching should succeed with status 200');
    assert.ok(mockResCreator.data, 'Should return data payload');
    assert.strictEqual(mockResCreator.data.role, 'creator', 'Role should be creator');
    assert.ok(Array.isArray(mockResCreator.data.matches), 'Matches should be an array');
    assert.strictEqual(mockResCreator.data.matches.length, 3, 'Should return exactly 3 matches');

    console.log('\n✔ Creator Match Results:');
    mockResCreator.data.matches.forEach((m, idx) => {
      console.log(`  [Match ${idx+1}] ${m.title} (by ${m.brandName}) -> ${m.fitScore}%`);
      console.log(`    Reason: ${m.reason}`);
      assert.ok(m.id, 'Match must contain id');
      assert.ok(m.title, 'Match must contain title');
      assert.ok(m.fitScore, 'Match must contain fitScore');
      assert.ok(m.reason, 'Match must contain reason');
    });
    console.log('✔ Creator matching payload verified.');

    console.log('\n⭐ ALL QUANTUM MATCHING CHECKS PASSED SUCCESSFULLY! ⭐');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification Failed:', error.message);
    process.exit(1);
  }
};

runVerification();
