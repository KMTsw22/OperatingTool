/*
const db = require('./db');
const redis = require('redis');
const parseInventory = require('./DecompressMethod');
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

// Redis 연결 오류 처리
redisClient.on('error', (err) => {
  console.error('Redis 오류:', err);
});

// Redis 연결 성공 시 로그
redisClient.on('connect', () => {
  console.log('Redis 서버에 연결되었습니다.');
});

// Redis 클라이언트 상태 확인
redisClient.on('ready', () => {
  console.log('Redis 클라이언트가 준비되었습니다.');
});

// 데이터베이스에서 Redis로 데이터 저장
const saveDataFromDBToRedis = async () => {
  try {
    console.log('Redis 클라이언트 연결 중...');
    await redisClient.connect();

    console.log('charinfo_new 테이블 데이터 조회 및 Redis 저장 시작');
    // charinfo_new 테이블에서 데이터 조회 및 Redis 저장
    const queryCharinfo = 'SELECT * FROM charinfo_new';
    db.query(queryCharinfo, async (err, results) => {
      if (err) {
        console.error('데이터베이스 쿼리 오류:', err);
        return;
      }

      try {
        await redisClient.set('charinfo', JSON.stringify(results), 'EX', 3600); // 데이터 저장 및 1시간 후 만료
        console.log('charinfo_new 테이블이 Redis에 저장되었습니다.');
      } catch (error) {
        console.error('Redis에 데이터 저장 오류:', error);
      }
    });

    console.log('item_new 테이블 데이터 조회 및 Redis 저장 시작');
    // item_new 테이블에서 데이터 조회 및 Redis 저장
    const queryItemNew = 'SELECT * FROM item_new';
    db.query(queryItemNew, async (err, results) => {
      if (err) {
        console.error('데이터베이스 쿼리 오류:', err);
        return;
      }

      try {
        const wantGid = 100759;
        const resultss = results.filter(item => item.GID === wantGid);
        console.log('필터링된 결과:', resultss);

        const parsedResultsPromises = resultss.map(async (row) => {
          const base64Data = row.equipItem.toString('base64'); // Buffer를 Base64로 인코딩
          return parseInventory(base64Data);
        });

        const parsedResults = await Promise.all(parsedResultsPromises);
        console.log('파싱된 결과:', parsedResults);

        await redisClient.set('item_new', JSON.stringify(parsedResults), 'EX', 3600); // 데이터 저장 및 1시간 후 만료
        console.log('item_new 테이블이 Redis에 저장되었습니다.');
      } catch (error) {
        console.error('Redis에 데이터 저장 오류:', error);
      } finally {
        console.log('Redis 클라이언트 종료 중...');
        await redisClient.quit();
        console.log('Redis 클라이언트 종료 완료');
      }
    });

  } catch (error) {
    console.error('데이터베이스에서 Redis로 데이터 저장 오류:', error);
  }
};

module.exports = {
  redisClient,
  saveDataFromDBToRedis,
};
*/