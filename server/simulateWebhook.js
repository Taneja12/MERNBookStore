const axios = require('axios');

const simulateWebhook = async () => {
    try {
        const webhookUrl = 'http://127.0.0.1:5000/api/orders/webhook'; // Use IPv4 address
        const headers = {
            'Content-Type': 'application/json',
            'x-forwarded-for': '52.66.25.127' // Use one of the allowed IPs for the test environment
        };
        const payload = {
            "event": "order.success",
            "data": {
                "order_id": "ORDER123",
                "order_amount": 1000,
                "order_currency": "INR"
                // Add more fields as per the Cashfree documentation
            }
        };

        const response = await axios.post(webhookUrl, payload, { headers });
        console.log('Webhook response:', response.data);
    } catch (error) {
        console.error('Error simulating webhook:', error.message);
    }
};

simulateWebhook();
