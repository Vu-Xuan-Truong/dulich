import { ZegoExpressEngine } from 'zego-express-engine-reactnative';
import { ZegoConfig } from '../Zegocloud/zegoConfig';

const zegoEngine = new ZegoExpressEngine(ZegoConfig.appID, ZegoConfig.appSign);