// src/setupTests.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';

// تعريف الـ Web APIs عالمياً لضمان توافقية React Router v7 و MSW الحديثة مع بيئة Jest/JSDOM القديمة
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;
