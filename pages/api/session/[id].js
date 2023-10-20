import axios from "axios";

export default async (req, res) => {
  if (req.method === "GET") {
    const authorizationHeader = req.headers && req.headers["authorization"];
    const id = req.query.id;
    try {
      const streamStatusResponse = await axios.get(
        `https://livepeer.com/api/session/${id}`,
        {
          headers: {
            "content-type": "application/json",
            authorization: authorizationHeader, // API Key needs to be passed as a header
          },
        }
      );

      if (streamStatusResponse && streamStatusResponse.data) {
        res.statusCode = 200;
        res.json({ ...streamStatusResponse.data });
      } else {
        res.statusCode = 500;
        res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }
};