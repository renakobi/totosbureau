// Test the complete payment flow
async function testCompleteFlow() {
  try {
    console.log('🧪 Testing Complete Payment Flow...\n');
    
    // Step 1: Create payment intent
    console.log('1️⃣ Creating payment intent...');
    const intentResponse = await fetch('http://localhost:3001/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 29.99, currency: 'usd' })
    });
    
    if (!intentResponse.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    const { clientSecret } = await intentResponse.json();
    console.log('✅ Payment intent created:', clientSecret);
    
    // Step 2: Simulate payment success
    console.log('\n2️⃣ Simulating payment success...');
    const successResponse = await fetch('http://localhost:3001/api/payment-success', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentIntent: {
          id: 'pi_test_' + Date.now(),
          amount: 2999,
          currency: 'usd',
          status: 'succeeded'
        },
        customerEmail: 'test@example.com'
      })
    });
    
    if (!successResponse.ok) {
      throw new Error('Failed to process payment success');
    }
    
    const result = await successResponse.json();
    console.log('✅ Payment success processed:', result);
    
    console.log('\n🎉 COMPLETE PAYMENT FLOW TEST SUCCESSFUL!');
    console.log('📧 Email notification would be sent');
    console.log('💰 Payment would be processed');
    console.log('🔄 Ready for frontend testing!');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testCompleteFlow();
