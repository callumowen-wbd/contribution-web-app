import JSZip from "jszip";
import { saveAs } from "file-saver";

const NHNDecPublicIP = `185.150.20.2`;
const LDCDecPublicIP = `198.147.4.122`;
const NHNDecQuantity = 16;
const LDCDecQuantity = 24;
const nocAmounts = {
  polandNoc: { length: 1 },
  franceNoc1: { length: 4 },
  franceNoc2: { length: 4 },
  italyNoc: { length: 2 },
  germanyNoc: { length: 3 },
  spainNoc: { length: 1 },
  ukNoc: { length: 1 },
  trocadero1: { length: 2 },
  trocadero2: { length: 2 },
  athletesVillage: { length: 1 },
  velodromeRfCam: { length: 1 },
  stadeDeFranceCabins1: { length: 4 },
  franceNoc3: { length: 1 },
  stadeDeFranceCabins2: { length: 4 },
};

export default function generateFullNocEncs() {
  let techHubNum = 35;
  let eventNum = 55;
  const zip = JSZip();
  for (const [_, value] of Object.entries(nocAmounts)) {
    zip.file(
      `EVT-MXE-0${eventNum}.cfg`,
      new Blob([getConfigContents(techHubNum, value.length)], {
        type: "text/plain",
      })
    );
    techHubNum += value.length;
    eventNum++;
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "noc-encs-full.zip");
  });
}

const getConfigContents = (techHubNum, length) => {
  let currentContents = getConfigBase(length);
  let count = 0;
  for (let i = 1; i <= LDCDecQuantity * 4; i++) {
    if (i == techHubNum + count) {
      currentContents =
        currentContents +
        `
[STREAM_${i}]
ID=${i}
Name=LDC_MXD_0${getTwoDigitNum(techHubNum + count)}
Contents=3
VideoSource=${count}
AudioSource=${4 * (count + 1) - 4},${4 * (count + 1) - 3},${
          4 * (count + 1) - 2
        },${4 * (count + 1) - 1}
TOS=128
MTU=1496
TTL=64
Port=${5 + ((techHubNum + count + 1) % 2)}0${getTwoDigitNum(techHubNum + count)}
Address=IPV4:${LDCDecPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=Yes
Shaping=No
Encrypted=No
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Client
NetworkAdaptive=No
`;
      if (count != length - 1) {
        count++;
      }
    } else {
    }
    currentContents =
      currentContents +
      `
[STREAM_${i}]
ID=${i}
Name=LDC_MXD_0${getTwoDigitNum(i)}
Contents=3
VideoSource=0
AudioSource=0,1,2,3
TOS=128
MTU=1496
TTL=64
Port=${5 + ((i + 1) % 2)}0${getTwoDigitNum(i)}
Address=IPV4:${LDCDecPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=No
Shaping=No
Encrypted=No
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Client
NetworkAdaptive=No
`;
  }
  count = 0;
  for (let z = 1; z <= NHNDecQuantity * 4; z++) {
    if (z == techHubNum + count) {
      currentContents =
        currentContents +
        `
[STREAM_${z + LDCDecQuantity * 4}]
ID=${z + LDCDecQuantity * 4}
Name=NHN_MXD_0${getTwoDigitNum(techHubNum + count)}
Contents=3
VideoSource=${count}
AudioSource=${4 * (count + 1) - 4},${4 * (count + 1) - 3},${
          4 * (count + 1) - 2
        },${4 * (count + 1) - 1}
TOS=128
MTU=1496
TTL=64
Port=${5 + ((techHubNum + count + 1) % 2)}0${getTwoDigitNum(techHubNum + count)}
Address=IPV4:${NHNDecPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=Yes
Shaping=No
Encrypted=No
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Client
NetworkAdaptive=No
`;
      if (count != length - 1) {
        count++;
      }
    } else {
      currentContents =
        currentContents +
        `
[STREAM_${z + LDCDecQuantity * 4}]
ID=${z + LDCDecQuantity * 4}
Name=NHN_MXD_0${getTwoDigitNum(z)}
Contents=3
VideoSource=0
AudioSource=0,1,2,3
TOS=128
MTU=1496
TTL=64
Port=${5 + ((z + 1) % 2)}0${getTwoDigitNum(z)}
Address=IPV4:${NHNDecPublicIP}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=No
Shaping=No
Encrypted=No
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Client
NetworkAdaptive=No
`;
    }
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

const getConfigBase = (length) => {
  return `[BNC-1]
FIRFilter=No

[BNC-2]
FIRFilter=No

[BNC-3]
FIRFilter=No

[BNC-4]
FIRFilter=No

[Video Encoder 0]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-1
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=Yes

[Video Encoder 1]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-2
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=${length > 1 ? `Yes` : `No`}

[Video Encoder 2]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-3
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=${length > 2 ? `Yes` : `No`}

[Video Encoder 3]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=No
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-4
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=${length > 3 ? `Yes` : `No`}

[Video Encoder 4]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-1
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=No

[Video Encoder 5]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-2
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=No

[Video Encoder 6]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=Yes
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-3
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=No

[Video Encoder 7]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=25
GOPStructure=IP
PartialFrameSkip=No
SkipSequenceLength=0
GopSize=25
GOPMode=Normal
ChromaSubSampling=4:2:2 10-bit
NumSlices=1
DeblockFilter=Yes
FilterTcOffset=-1
FilterBetaOffset=-1
IntraRefresh=No
EncodingProfile=Main422-10
SceneChangeResilience=Automatic
CodecAlgorithm=H265
RateControlMode=Vbr
VideoMaxBitRate=22000
CpbSizeMs=0
MaxPictureSizeRatio=12.00
ScalingMatrix=Default
VideoInput=BNC-4
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=No

[Audio Encoder 0]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch1+2
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=Yes

[Audio Encoder 1]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch3+4
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=Yes

[Audio Encoder 2]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch5+6
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=Yes

[Audio Encoder 3]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch7+8
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=Yes

[Audio Encoder 4]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch1+2
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 1 ? `Yes` : `No`}

[Audio Encoder 5]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch3+4
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 1 ? `Yes` : `No`}

[Audio Encoder 6]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch5+6
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 1 ? `Yes` : `No`}

[Audio Encoder 7]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch7+8
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 1 ? `Yes` : `No`}

[Audio Encoder 8]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch1+2
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 2 ? `Yes` : `No`}

[Audio Encoder 9]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch3+4
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 2 ? `Yes` : `No`}

[Audio Encoder 10]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch5+6
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 2 ? `Yes` : `No`}

[Audio Encoder 11]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch7+8
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 2 ? `Yes` : `No`}

[Audio Encoder 12]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch1+2
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 3 ? `Yes` : `No`}

[Audio Encoder 13]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch3+4
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 3 ? `Yes` : `No`}

[Audio Encoder 14]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch5+6
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 3 ? `Yes` : `No`}

[Audio Encoder 15]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch7+8
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=${length > 3 ? `Yes` : `No`}

[Audio Encoder 16]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch9+10
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 17]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch11+12
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 18]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch13+14
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 19]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI1Ch15+16
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 20]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch9+10
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 21]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch11+12
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 22]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch13+14
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 23]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI2Ch15+16
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 24]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch9+10
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 25]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch11+12
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 26]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch13+14
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 27]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI3Ch15+16
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 28]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch9+10
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 29]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch11+12
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 30]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch13+14
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[Audio Encoder 31]
AudioBitRate=128
PTSOffset=0
AudioInput=SDI4Ch15+16
AudioSampleRate=48
AudioMode=Stereo
AudioAlgorithm=MPEG2-AAC-LC-ADTS
Capture=No
MaxCaptureSize=8000
AudioLevel=6
STCSourceInterface=Auto
Language=(None)
AutoStart=No

[ADINSERTION_SOURCE_1]
ID=1
Input=Video
InputInterface=0
Capture=No
MaxCaptureSize=0
Synchronization=Auto
LeapSeconds=37
TimeDescriptorPeriod=0
PreEventReminders=3
Scte35MsgDeltaMs=2000
Scte35MsgSapType=3
AutoStart=No

[ADINSERTION_SOURCE_2]
ID=2
Input=Video
InputInterface=1
Capture=No
MaxCaptureSize=0
Synchronization=Auto
LeapSeconds=37
TimeDescriptorPeriod=0
PreEventReminders=3
Scte35MsgDeltaMs=2000
Scte35MsgSapType=3
AutoStart=No

[ADINSERTION_SOURCE_3]
ID=3
Input=Video
InputInterface=2
Capture=No
MaxCaptureSize=0
Synchronization=Auto
LeapSeconds=37
TimeDescriptorPeriod=0
PreEventReminders=3
Scte35MsgDeltaMs=2000
Scte35MsgSapType=3
AutoStart=No

[ADINSERTION_SOURCE_4]
ID=4
Input=Video
InputInterface=3
Capture=No
MaxCaptureSize=0
Synchronization=Auto
LeapSeconds=37
TimeDescriptorPeriod=0
PreEventReminders=3
Scte35MsgDeltaMs=2000
Scte35MsgSapType=3
AutoStart=No

[SNAPSHOT]
Quality=100
Format=PNG
Overwrite=No
Width=0
Height=0
Palette=rgb
ScalingAlgo=0
`;
};
