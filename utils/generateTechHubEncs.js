import JSZip from "jszip";
import { saveAs } from "file-saver";

// NHN: 10 encs, 16 decs
const NHNEncPublicIP = `185.150.20.3`;
const NHNDecPublicIP = `185.150.20.2`;
const NHNEncSubnet = `10.195.28.`;
const NHNEncStartIP = 71;
const NHNDecStartIP = 21;
const NHNEncQuantity = 10;
const LDCEncQuantity = 18;
const NHNDecQuantity = 16;

// Public IP: 185.150.20.3 (10.195.28.71 -) encs, 185.150.20.2 (10.195.28.21 -) decs
// LDC: 18 encs, 24 decs

export default function generateTechHubEncs() {
  const zip = JSZip();
  const NHNEncFolder = zip.folder("nhn-encs");
  for (let i = 0; i < NHNEncQuantity; i++) {
    // for each enc
    let config = configBase;
    for (let z = 0; z < 8; z++) {
      // for each stream
      let twoDigitNum = getTwoDigitNum(i, z);
      config =
        config +
        `[STREAM_${z + 1}]
ID=${z + 1}
Name=NHN_MXE_0${twoDigitNum}${z % 2 == 1 ? ` Backup` : ""}
Contents=3
VideoSource=${Math.floor(z / 2)}
AudioSource=${4 * Math.floor(z / 2)},${4 * Math.floor(z / 2) + 1},${
          4 * Math.floor(z / 2) + 2
        },${4 * Math.floor(z / 2) + 3}
TOS=128
MTU=1496
TTL=64
Port=${getPortNum(i, z, twoDigitNum)}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=${z % 2 == 1 ? `No` : `Yes`}
Shaping=No
Encrypted=No
Authentication=auto
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Server
Redundancy=Optional
LinkWeight=0
SecondaryLinkWeight=0
NetworkAdaptive=No

`;
    }
    NHNEncFolder.file(
      `NHN-MXE-0${getTwoDigitNum(i, 0)}-0${getTwoDigitNum(i, 7)}.cfg`,
      new Blob([config], { type: "text/plain" })
    );
  }
  const LDCEncFolder = zip.folder("ldc-encs");
  for (let i = 0; i < LDCEncQuantity; i++) {
    // for each enc
    let config = configBase;
    for (let z = 0; z < 8; z++) {
      // for each stream
      let twoDigitNum = getTwoDigitNum(i, z);
      config =
        config +
        `[STREAM_${z + 1}]
ID=${z + 1}
Name=LDC_MXE_0${twoDigitNum}${z % 2 == 1 ? ` Backup` : ""}
Contents=3
VideoSource=${Math.ceil((z + 1) / 2) - 1}
AudioSource=${4 * Math.ceil((z + 1) / 2) - 4},${
          4 * Math.ceil((z + 1) / 2) - 3
        },${4 * Math.ceil((z + 1) / 2) - 2},${4 * Math.ceil((z + 1) / 2) - 1}
TOS=128
MTU=1496
TTL=64
Port=${getPortNum(i, z, twoDigitNum)}
Encapsulation=TS-SRT
RTCPEnabled=No
AutoStart=${z % 2 == 1 ? `No` : `Yes`}
Shaping=No
Encrypted=No
Authentication=auto
FEC=No
VideoPID=0
AudioPID=0,0,0,0
PCRPID=0
PMTPID=0
TransportStreamID=1
ProgramNumber=0
SrtLatency=40
Ceiling=15
Mode=Server
Redundancy=Optional
LinkWeight=0
SecondaryLinkWeight=0
NetworkAdaptive=No

`;
    }
    LDCEncFolder.file(
      `LDC-MXE-0${getTwoDigitNum(i, 0)}-0${getTwoDigitNum(i, 7)}.cfg`,
      new Blob([config], { type: "text/plain" })
    );
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    saveAs(content, "th-encs.zip");
  });
}

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

const configBase = `[BNC-1]
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
EncodedPictureRate=0
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
EncodedPictureRate=0
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
AutoStart=Yes

[Video Encoder 2]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=0
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
AutoStart=Yes

[Video Encoder 3]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=0
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
VideoInput=BNC-4
AspectRatio=Auto
DynamicRange=SDR
TimeCode=SYSTEM
SystemTCCountMode=SMPTE12M-1
SystemTCResync=Yes
SystemTCResyncHour=0
ResizeMode=Scale
ClosedCaption=Off
AutoStart=Yes

[Video Encoder 4]
VideoBitRate=20000
EncodedResolution=Auto
PTSOffset=0
EncodedPictureRate=0
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
EncodedPictureRate=0
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
EncodedPictureRate=0
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
EncodedPictureRate=0
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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
AutoStart=Yes

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
