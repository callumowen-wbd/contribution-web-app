export default async function handler(req, res) {
  console.log("---------------");
  console.log("UPDATING STREAM");
  console.log("---------------");
  console.log(req.body);
  const getHeaders = () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
    );
    myHeaders.append("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8");
    myHeaders.append("Cache-Control", "max-age=0");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append(
      "Cookie",
      "SessionID=BstkMmM4AYydLPMTSeHurScYHEDj1uQCUjUFFHJeDhro5dgXrXsTPEPvhqOiSCVN"
    );
    myHeaders.append("Sec-Fetch-Dest", "document");
    myHeaders.append("Sec-Fetch-Mode", "navigate");
    myHeaders.append("Sec-Fetch-Site", "none");
    myHeaders.append("Sec-Fetch-User", "?1");
    myHeaders.append("Upgrade-Insecure-Requests", "1");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"'
    );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", '"Windows"');
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
  };
  const requestOptions = {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(req.body),
    redirect: "follow",
  };
  const response = await fetch(
    "https://10.101.2.38/apis/streams/7",
    requestOptions
  );
  const data = await response.json();

  res.status(200).json(data);
}
