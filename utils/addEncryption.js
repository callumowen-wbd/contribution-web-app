export default async function addEncryption({ info: dataToUpdateWith }) {
  console.log(dataToUpdateWith);
  dataToUpdateWith.passphrase = process.env.NEXT_PUBLIC_PASSPHRASE;
  dataToUpdateWith.encKeyLength = 32;
  dataToUpdateWith.passphraseSet = true;
  const updateStreamResponse = await fetch("/api/updateStream", {
    method: "PUT",
    body: JSON.stringify(dataToUpdateWith),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const updateStreamData = await updateStreamResponse.json();
  console.log(updateStreamData);
}
