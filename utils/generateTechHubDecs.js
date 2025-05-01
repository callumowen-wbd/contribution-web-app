import JSZip from "jszip";
import { saveAs } from "file-saver";

const NHNDecQuantity = 16;
const LDCDecQuantity = 24;

export default function generateTechHubDecs() {
  const zip = JSZip();
  const NHNDecFolder = zip.folder("nhn-decs");
  for (let i = 0; i < NHNDecQuantity; i++) {
    // for each dec
    let config = configBase;
    for (let z = 0; z < 8; z++) {
      // for each stream
      config = config + getCurrentStreamConfig("NHN", i, z);
    }
    NHNDecFolder.file(
      `NHN-MXD-0${getTwoDigitNum(i, 0)}-0${getTwoDigitNum(i, 7)}.cfg`,
      new Blob([config], { type: "text/plain" })
    );
  }
  const LDCDecFolder = zip.folder("ldc-decs");
  for (let i = 0; i < LDCDecQuantity; i++) {
    // for each dec
    let config = configBase;
    for (let z = 0; z < 8; z++) {
      // for each stream
      config = config + getCurrentStreamConfig("LDC", i, z);
    }
    LDCDecFolder.file(
      `LDC-MXD-0${getTwoDigitNum(i, 0)}-0${getTwoDigitNum(i, 7)}.cfg`,
      new Blob([config], { type: "text/plain" })
    );
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "th-decs.zip");
  });
}

const getCurrentStreamConfig = (techHub, i, z) => {
  let twoDigitNum = getTwoDigitNum(i, z);
  return `[STREAM_${z + 1}]
ID=${z + 1}
Name=${techHub}_MXD_0${twoDigitNum}${z % 2 == 1 ? ` Backup` : ""}
Contents=0
ProgramNumber=0
Port=${getPortNum(i, z, twoDigitNum)}
Address=IPANY:
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=No
Mode=Server
SourcePort=0
SrtLatency=40
SrtFlipEnabled=No
Passphrase=3qb@XsB8oOBe#h24sKfVA0K*U!i4Pg0e
Authentication=auto
FEC=No

`;
};

// e.g. 0, 0 and 0, 1 should return 01 ... 1, 2 and 1, 3 should return 04
// z=0 odd card 1 ... z=1 even card 1 ... z=2 odd card 2 ... z=3 even card 2 ... z=4 odd card 3
const getTwoDigitNum = (cardNum, streamNum) => {
  if (cardNum % 2 == 0) {
    // odd card
    let numToReturn = 8 * (cardNum / 2) + 2 * Math.floor(streamNum / 2) + 1;
    return numToReturn < 10 ? `0${numToReturn}` : numToReturn;
  } else {
    // even card
    let numToReturn =
      8 * (Math.ceil(cardNum / 2) - 1) + 2 * Math.floor(streamNum / 2) + 2;
    return numToReturn < 10 ? `0${numToReturn}` : numToReturn;
  }
};

const getPortNum = (cardNum, streamNum, twoDigitNum) => {
  if (cardNum % 2 == 0) {
    // odd card
    let numToAppend = Number(twoDigitNum) + (streamNum % 2);
    return `50${numToAppend < 10 ? `0${numToAppend}` : numToAppend}`;
  } else {
    // even card
    let numToAppend = Number(twoDigitNum) - (streamNum % 2);
    return `60${numToAppend < 10 ? `0${numToAppend}` : numToAppend}`;
  }
};

const configBase = `[DECODER_0]
ID=0
StreamId=1
AltStreamId=-1
FailoverTimeout=3
Latency=0
DisplayFormat=0
StillImage=1
StillDelay=3
VcuAddLatency=0
SyncMode=2
PTSBufferingMode=3
FixedBufferDelay=0
MultiSyncBufferDelay=400
Outputs=1
OutputQuadMode=0
HardwareDelayAdd=0
DropCorruptedFrames=No
AutoStart=Yes
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_1]
ID=1
StreamId=3
AltStreamId=-1
FailoverTimeout=3
Latency=0
DisplayFormat=0
StillImage=1
StillDelay=3
VcuAddLatency=0
SyncMode=2
PTSBufferingMode=3
FixedBufferDelay=0
MultiSyncBufferDelay=400
Outputs=2
OutputQuadMode=0
HardwareDelayAdd=0
DropCorruptedFrames=No
AutoStart=Yes
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_2]
ID=2
StreamId=5
AltStreamId=-1
FailoverTimeout=3
Latency=0
DisplayFormat=0
StillImage=1
StillDelay=3
VcuAddLatency=0
SyncMode=2
PTSBufferingMode=3
FixedBufferDelay=0
MultiSyncBufferDelay=400
Outputs=3
OutputQuadMode=0
HardwareDelayAdd=0
DropCorruptedFrames=No
AutoStart=Yes
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_3]
ID=3
StreamId=7
AltStreamId=-1
FailoverTimeout=3
Latency=0
DisplayFormat=0
StillImage=1
StillDelay=3
VcuAddLatency=0
SyncMode=2
PTSBufferingMode=3
FixedBufferDelay=0
MultiSyncBufferDelay=400
Outputs=4
OutputQuadMode=0
HardwareDelayAdd=0
DropCorruptedFrames=No
AutoStart=Yes
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

`;
