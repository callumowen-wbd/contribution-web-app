import JSZip from "jszip";
import { saveAs } from "file-saver";

const NHNEncPublicIP = `185.150.20.3`;
const LDCEncPublicIP = `198.147.4.123`;
const NHNEncQuantity = 10;
const LDCEncQuantity = 18;
const MZQuantity = 34;

export default function generateMixedZoneDecs() {
  const zip = JSZip();
  for (let mzNum = 21; mzNum <= 20 + MZQuantity; mzNum++) {
    // for each mz dec
    zip.file(
      `EVT-MXD-0${getTwoDigitNum(mzNum)}.cfg`,
      new Blob([getConfigContents(mzNum)], { type: "text/plain" })
    );
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "mz-decs.zip");
  });
}

const getConfigContents = (mzNum) => {
  let currentContents = getConfigBase(mzNum);
  for (let i = 1; i <= LDCEncQuantity * 4; i++) {
    currentContents =
      currentContents +
      `
[STREAM_${i}]
ID=${i}
Name=LDC_MXE_0${getTwoDigitNum(i)}
Contents=0
ProgramNumber=0
Port=${5 + ((i + 1) % 2)}0${getTwoDigitNum(i)}
Address=IPV4:${LDCEncPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=No
Mode=Client
SourcePort=0
SrtLatency=40
SrtFlipEnabled=No
Passphrase=3qb@XsB8oOBe#h24sKfVA0K*U!i4Pg0e
Authentication=none
FEC=No
`;
  }
  for (let z = 1; z <= NHNEncQuantity * 4; z++) {
    currentContents =
      currentContents +
      `
[STREAM_${z + LDCEncQuantity * 4}]
ID=${z + LDCEncQuantity * 4}
Name=NHN_MXE_0${getTwoDigitNum(z)}
Contents=0
ProgramNumber=0
Port=${5 + ((z + 1) % 2)}0${getTwoDigitNum(z)}
Address=IPV4:${NHNEncPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=No
Mode=Client
SourcePort=0
SrtLatency=40
SrtFlipEnabled=No
Passphrase=3qb@XsB8oOBe#h24sKfVA0K*U!i4Pg0e
Authentication=none
FEC=No
`;
  }
  return currentContents;
};

const getTwoDigitNum = (i) => {
  let num = "0";
  if (i < 10) {
    num = num + `${i}`;
  } else {
    num = `${i}`;
  }
  return num;
};

const getConfigBase = (mzNum) => {
  return `[DECODER_0]
ID=0
StreamId=-1
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
AutoStart=No
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_1]
ID=1
StreamId=-1
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
AutoStart=No
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_2]
ID=2
StreamId=-1
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
AutoStart=No
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

[DECODER_3]
ID=3
StreamId=-1
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
AutoStart=No
HDRDisplayMode=-1
ClockTrackingMode=2
AVSyncMasterMode=10

`;
};
