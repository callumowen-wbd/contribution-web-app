import { getTwoDigitNum } from "./generateMixedZoneEncs";

export const testTechHubDecoders = [
  {
    name: "LDC_MXD_065",
    internalIP: "10.101.2.37",
    externalIP: "198.147.4.122",
    port: 5065,
  },
  {
    name: "LDC_MXD_066",
    internalIP: "10.101.2.38",
    externalIP: "198.147.4.122",
    port: 6066,
  },
  {
    name: "LDC_MXD_067",
    internalIP: "10.101.2.37",
    externalIP: "198.147.4.122",
    port: 5067,
  },
  {
    name: "LDC_MXD_068",
    internalIP: "10.101.2.38",
    externalIP: "198.147.4.122",
    port: 6068,
  },
  {
    name: "LDC_MXD_069",
    internalIP: "10.101.2.37",
    externalIP: "198.147.4.122",
    port: 5069,
  },
  {
    name: "LDC_MXD_070",
    internalIP: "10.101.2.38",
    externalIP: "198.147.4.122",
    port: 6070,
  },
  {
    name: "LDC_MXD_071",
    internalIP: "10.101.2.37",
    externalIP: "198.147.4.122",
    port: 5071,
  },
  {
    name: "LDC_MXD_072",
    internalIP: "10.101.2.38",
    externalIP: "198.147.4.122",
    port: 6072,
  },
];

export const eventEncoders = [
  {
    name: "EVT_MXE_032",
    internalIP: "10.88.88.43",
  },
  {
    name: "EVT_MXE_033",
    internalIP: "10.88.88.44",
  },
];

export const techHubDecoders = generateTechHubDecoders();
function generateTechHubDecoders() {
  let decoders = [];
  for (let i = 1; i < 97; i++) {
    decoders[i - 1] = {
      id: i,
      name: `LDC_MXD_0${getTwoDigitNum(i)}`,
      port: (5 + ((i + 1) % 2)) * 1000 + Number(getTwoDigitNum(i)),
      externalIP: "198.147.4.122",
      internalIP: `10.101.2.${
        21 + ((i - 1) % 2) + 2 * Math.floor((i - 1) / 8)
      }`,
    };
  }
  return decoders;
}
