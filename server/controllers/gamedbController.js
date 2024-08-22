const db = require('../config/db');
const logdb = require('../config/logdb');
const parseInventory = require('../config/DecompressMethod');
//const {redisClient, saveDataFromDBToRedis} = require('../config/redis');

exports.dbinfo = (req, res) => {
  res.json({ host:db.config.host, user:db.config.user, database:db.config.database });  // 클라이언트에 응답
};

exports.SearchUser = async (req, res) => {
  const { UID, GID, CharName } = req.query;
  let query = 'SELECT * FROM charinfo_new WHERE 1=1';
  const params = [];

  // 쿼리 조건 추가
  if (UID) {
    query += ' AND AID = ?';
    params.push(parseInt(UID, 10));
  }
  if (GID) {
    query += ' AND GID = ?';
    params.push(parseInt(GID, 10));
  }
  if (CharName) {
    query += ' AND CharName LIKE ?';
    params.push(`%${CharName}%`);
  }

  try {
    // 데이터베이스에서 데이터 조회
    db.query(query, params, (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류');
        return;
      }

      // 필터링 및 데이터 포맷
      const basicData = results.map(item => ({
        GID: item.GID,
        AID: item.AID,
        CharName: item.CharName,
        job: item.job,
        clevel: item.clevel,
        joblevel: item.joblevel,
        mapidx: item.mapidx,
        xpos: item.xPos,
        ypos: item.yPos,
        Guildid: item.GuildID,
        logouttime: item.logouttime,
        zeny: item.zeny,
        guildpoint: item.guildpoint,
      }));

      res.json(basicData);
    });
  } catch (err) {
    console.error('쿼리 실행 오류: ', err);
    res.status(500).send('서버 오류');
  }
};

// 사용자 검색
/*
exports.SearchUser = async (req, res) => {
  const { UID, GID, CharName } = req.query;

  try {
    
    await redisClient.connect();
    const cachedData = await redisClient.get('charinfo'); // 비동기적으로 get 메서드를 호출

    if (cachedData) {
      
      const allData = JSON.parse(cachedData);
      let filteredData = allData;

      // 필터링 적용
      if (UID) {
        filteredData = filteredData.filter(item => item.AID === parseInt(UID));
      }
      if (GID) {
        filteredData = filteredData.filter(item => item.GID === parseInt(GID));
      }
      if (CharName) {
        filteredData = filteredData.filter(item => item.CharName.includes(CharName));
      }
      const basicData = filteredData.map(item => {
        return {
          GID: item.GID,
          AID: item.AID,
          CharName: item.CharName,
          job: item.job,
          clevel:item.clevel,
          joblevel:item.joblevel,
          mapidx:item.mapidx,
          xpos:item.xPos,
          ypos:item.yPos,
          Guildid:item.GuildID,
          logouttime: item.logouttime,
          zeny: item.zeny,
          guildpoint:item.guildpoint,
        };
      });

      res.json(basicData);
    } else {
      console.error('Redis에 캐시된 데이터가 없습니다.');
      res.status(404).send('데이터를 찾을 수 없습니다.');
    }
  } catch (err) {
    console.error('Redis 가져오기 오류: ', err);
    res.status(500).send('서버 오류');
  } finally{
    redisClient.quit();
  }
};*/
exports.SearchUserForQuery = (req, res) => {
  const { stringquery } = req.query;
  let query = stirngquery; // 기본 쿼리
  const params = [];
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('쿼리 실행 오류: ', err);
      res.status(500).send('서버 오류');
      return;
    }
    res.json(results);
  });
};

// 아이템 정보 검색
exports.ItemInfo = async (req, res) => {
  const { GID } = req.query;
  const query = 'SELECT equipItem FROM item_new WHERE GID = ?';
  const params = [GID];

  try {
    db.query(query, params, async (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류 : select equipItem');
        return;
      }

      // 데이터 압축 해제 및 파싱
      try {
        const result = results[0];
        if (result && result.equipItem) {
          const parsedData = await parseInventory(result.equipItem);
          res.json(parsedData);
        } else {
          res.status(404).send('아이템 정보를 찾을 수 없습니다.');
        }
      } catch (parseError) {
        console.error('압축 해제 또는 파싱 오류:', parseError);
        res.status(500).send('서버 오류 : 압축 해제 또는 파싱 오류');
      }
    });
  } catch (err) {
    console.error('서버 오류:', err);
    res.status(500).send('서버 오류');
  }
};


// 로그테이블 정보 검색
exports.LogInfo = async (req, res) => {
  const { UID, GID, CharName, tableType, OffSet } = req.query;
  let query = 'SELECT * FROM ' + tableType + ' where 1=1';
  const params = [];
  if (!UID && !GID && !CharName) return;
  if (UID) {
    query += ' AND uid = ?';
    params.push(parseInt(UID, 10));
  }
  if (GID) {
    query += ' AND gid = ?';
    params.push(parseInt(GID, 10));
  }
  if (CharName) {
    query += ' AND charname LIKE ?';
    params.push(`%${CharName}%`);
  }
  query += ' ORDER BY time DESC LIMIT 30 OFFSET ?';
  params.push(parseInt(OffSet, 10)); // offset

  try {
    logdb.query(query, params, async (err, results) => {
      if (err) {
        console.error('쿼리 실행 오류: ', err);
        res.status(500).send('서버 오류 : select equipItem');
        return;
      }

      // 데이터 압축 해제 및 파싱
      try {
        const result = results[0];
        if (results) {
          res.json(results);
        } else {
          res.status(404).send('로그 정보를 찾을 수 없습니다.');
        }
      } catch {
        console.error('로그테이블 오류:');
        res.status(500).send('서버 오류 : 로그테이블오류');
      }
    });
  } catch (err) {
    console.error('서버 오류:', err);
    res.status(500).send('서버 오류');
  }
};