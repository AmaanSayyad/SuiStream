import axios from "axios";

export default async (req, res) => {
  if (req.method === "POST") {
    const authorizationHeader = req.headers && req.headers["authorization"];
    const streamName = req.body && req.body.name;
    const streamProfiles = req.body && req.body.profiles;

    try {
      const createStreamResponse = await axios.post(
        "https://livepeer.com/api/stream",
        {
          name: streamName,
          profiles: streamProfiles,
          record:true
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: authorizationHeader, // API Key needs to be passed as a header
          },
        }
      );

      if (createStreamResponse && createStreamResponse.data) {
        res.statusCode = 200;
        res.json({ ...createStreamResponse.data });
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      res.statusCode = 500;

      // Handles Invalid API key error
      if (error.response.status === 403) {
        res.statusCode = 403;
      }
      res.json({ error });
    }
  }
};