import JSZip from "jszip";
import { saveAs } from "file-saver";

// initiate constants for key fixed values such as IP Addresses and quantities
const NHNDecPublicIP = `185.150.20.2`;
const LDCDecPublicIP = `198.147.4.122`;
const NHNDecQuantity = 16;
const LDCDecQuantity = 24;
const MZQuantity = 34;

export default function generateMixedZoneEncs() {
  const zip = JSZip(); // initiate empty zip folder ahead of download
  // for each mixed zone, add a file to the empty zip folder for each new EVT_MXE, starting from 021, containing relevant config details
  for (let mzNum = 21; mzNum <= 20 + MZQuantity; mzNum++) {
    zip.file(
      `EVT-MXE-0${getTwoDigitNum(mzNum)}.cfg`, // name file appropriately to match EVT_MXE number
      new Blob([getConfigContents(mzNum)], { type: "text/plain" }) // populate file with plaintext data based on the value returned from the getConfigContents() function, where mzNum is passed as a parameter
    );
  }
  // download mz-encs.zip containing all .cfg files for EVT_MXEs
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "mz-encs.zip");
  });
}

// define function to return contents of .cfg file, taking mzNum as an argument so stream details correspond correctly
const getConfigContents = (mzNum) => {
  let currentContents = configBase; // initialise contents with baseline config defined below, which remains the same for all EVT_MXEs
  // for each LDC Decoder, append a stream targeted at that decoder to the contents of the config file
  for (let i = 1; i <= LDCDecQuantity * 4; i++) {
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
AutoStart=${mzNum - 20 == i ? `Yes` : `No`}
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
  // for each NHN Decoder, append a stream targeted at that decoder to the contents of the config file.
  for (let z = 1; z <= NHNDecQuantity * 4; z++) {
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
AutoStart=${mzNum - 20 == z ? `Yes` : `No`}
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
  return currentContents;
};

// define function to get a two digit number from the MZ Number to name the file appropriately
// e.g. passing an argument of 7 into the function returns "07"
// e.g. passing an argument of 32 into the function returns "32"
export const getTwoDigitNum = (i) => {
  let num = "0";
  if (i < 10) {
    num = num + `${i}`;
  } else {
    num = `${i}`;
  }
  return num;
};

// define baseline config settings
// autostart the first video encoder and the first four audio encoders
// video encode: CVBR, 20-22Mbps, 4:2:2 10-bit
// audio encode: 4x pairs of AAC audio
// TO CHANGE ENCODE PARAMETERS IN THE CONFIG FILES,
// CHANGE THEM HERE, SAVE, AND RE-GENERATE THE FILES
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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
AutoStart=No

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
