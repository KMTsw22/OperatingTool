const zlib = require('zlib');

// 데이터 압축 해제 함수
const decompressData = (compressedBuffer) => {
    return new Promise((resolve, reject) => {
      console.log('압축 해제 시작');
  
      zlib.inflateRaw(compressedBuffer, (err, decompressedBuffer) => {
        if (err) {
          console.error('압축 해제 오류:', err);
          reject(err);
        } else {
          console.log('압축 해제 완료');
          resolve(decompressedBuffer);
        }
      });
    });
  };
  
  // Binary Data를 파싱하는 함수
  function parseBinaryData(buffer) {
    let offset = 0;
    const items = [];
  
    console.log('데이터 파싱 시작');
  
    while (offset < buffer.length) {
      const itemid = buffer.readUInt32LE(offset);
      offset += 4;
  
      const tempdb = {
        ITID: itemid,
        Flag: buffer.readUInt8(offset),
      };
      offset += 1;
  
      tempdb.m_count = buffer.readUInt16LE(offset);
      offset += 2;
  
      tempdb.slot = [];
      for (let i = 0; i < 4; i++) {
        tempdb.slot[i] = buffer.readUInt32LE(offset);
        offset += 4;
      }
  
      tempdb.m_isIdentified = (tempdb.Flag & 1) > 0;
      tempdb.m_isBind = (tempdb.Flag & 2) > 0;
      tempdb.m_bPlaceInventoryPrivateTab = (tempdb.Flag & 4) > 0;
  
      if (tempdb.Flag & 64) {
        tempdb.m_unique_identity_number = buffer.readBigUInt64LE(offset);
        offset += 8;
      }
      if (tempdb.Flag & 128) {
        tempdb.m_hire_expire_date = buffer.readBigUInt64LE(offset);
        offset += 8;
      }
  
      items.push(tempdb);
      console.log('아이템 파싱 완료:', tempdb);
    }
  
    console.log('데이터 파싱 완료');
    return items;
  }
  
  // 압축 해제된 데이터를 파싱하는 함수
  const parseInventory = async (base64CompressedData) => {
    try {
      console.log('데이터 압축 해제 및 파싱 시작');
  
      const compressedBuffer = Buffer.from(base64CompressedData, 'base64'); // Base64로 인코딩된 압축 데이터를 Buffer로 변환
      console.log('압축된 데이터 버퍼 생성 완료');
  
      // 압축 해제
      const decompressedBuffer = await decompressData(compressedBuffer);
      console.log('압축 해제된 데이터 버퍼:', decompressedBuffer);
  
      // 해제된 데이터를 파싱
      const parsedData = parseBinaryData(decompressedBuffer);
      console.log('파싱된 데이터:', parsedData);
  
      return parsedData; // 파싱된 데이터 반환
    } catch (error) {
      console.error('압축 해제 또는 파싱 오류:', error);
    }
  };
module.exports = parseInventory;