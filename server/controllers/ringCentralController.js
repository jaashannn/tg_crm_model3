import axios from "axios";
export const makeCall = async (req, res) => {
  const { toNumber, fromNumber, jwt } = req.body;

  if (!jwt || !toNumber || !fromNumber) {
    return res.status(400).json({ success: false, message: 'Missing required fields: jwt, toNumber, or fromNumber.' });
  }

  try {
    const response = await axios.post(
      'https://platform.ringcentral.com/restapi/v1.0/account/~/extension/~/ring-out',
      {
        from: { phoneNumber: fromNumber },
        to: { phoneNumber: toNumber },
        playPrompt: true,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error making call:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
};
