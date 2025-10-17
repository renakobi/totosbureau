const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing payment intent creation...');
    
    const response = await fetch('http://localhost:3001/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 29.99,
        currency: 'usd'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payment intent created successfully:', data);
    } else {
      const error = await response.text();
      console.log('❌ Error:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testAPI();
