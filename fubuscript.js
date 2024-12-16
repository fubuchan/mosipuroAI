let ws = new WebSocket('wss://socket-server-template-7yue.onrender.com');

    // 動的にラジオボタンのイベントリスナーを設定
       const radioKeys = [
  "none_radio", "health_radio", "power_radio", "athlete_radio", "hihi_radio", "cry_radio", "baby_radio",
  "yancha_radio", "jyuken_radio", "tear_radio", "hana_radio", "sports_radio", "instagirl_radio", "otaku_radio",
  "benkyo_radio", "h_radio", "hiyokko_radio", "parttimer_radio", "gal_radio", "nomoney_radio", "home_radio",
  "guy_radio", "jyakuhai_radio", "salaryman_radio", "ronpa_radio", "stress_radio", "gumble_radio", "dream_radio",
  "sinkei_radio", "tufu_radio", "parents_radio", "digital_radio", "copy_radio", "designer_radio", "ogosyo_radio",
  "jinji_radio", "wresler_radio", "spiritual_radio", "bukiyo_radio", "mago_radio", "VIP_radio", "rogo_radio",
  "rogan_radio", "kaigo_radio", "seki_radio", "kioku_radio", "ill_radio", "car_radio", "sleep_radio", "tooth_radio",
  "heaven_radio"
];

    
    // ラジオボタンの値を更新する関数
    function updateRadioValue(radio) {
      // 他のラジオボタンを未選択状態（value: 0）にする
      const allRadios = document.querySelectorAll(`input[name="${radio.name}"]`);
      allRadios.forEach((r) => {
        if (r !== radio) {
          r.value = "0"; // 選択されていないラジオボタンをリセット
        }
      console.log(`選択された運動: ${radio.dataset.label}`);
      });
      // 押されたラジオボタンの値を 1 に設定
      radio.value = "1";
    }
    function updateRadioValue2(radio) {
      console.log(`選択されたキャラ: ${radio.dataset.label}`);
    }
    function toggleEnterValue() {
      const button = document.querySelector('.enter');
      
      // 現在の値を取得し、0と1を切り替え
      const currentValue = button.value;
      const newValue = currentValue === "0" ? "1" : "0";
      const age = document.querySelector('.age_slider').value;
      const description = document.getElementById('description');
      const image = document.getElementById('image');
      var enterButton = document.querySelector('input[name="enter"]');  // ボタンの参照
     enterButton.style.display = 'none';  // ボタンを非表示にする
  
  // ここに他の処理（例えば画像生成など）を追加することができます

  // 例として説明文と画像を更新
      description.textContent = `${age}歳のあなたにぴったりのプロレス技は...`;
      image.src = ""; // 適切な画像URLを挿入
      image.style.display = "block";
      
      // 値を更新
      button.value = newValue;
      ws.send(JSON.stringify({ enter: newValue }));
    }
    
    // ラジオボタンのイベントリスナーを動的に設定
    radioKeys.forEach((key) => {
      const element = document.querySelector(`.${key}`);
      if (element) {
        element.addEventListener('change', (event) => {
          updateRadioValue(element); // 値を更新
          ws.send(JSON.stringify({ [key]: element.value })); // サーバーに送信
        });
      }
    });
    
    // スライダーのイベントリスナー
    let age_slider = document.querySelector('.age_slider');
    if (age_slider) {
      age_slider.addEventListener('change', (event) => {
        const ageValue = parseInt(age_slider.value);
        updateCharacterOptions(ageValue);
        ws.send(JSON.stringify({ 'slider2': age_slider.value }));
        
      });
    }
    // 画像のURLを配列に格納

    function updateCharacterOptions(ageValue) {
      // すべてのラジオボタンを非表示にする
      const allCharacterRadios = document.querySelectorAll('input[name="chara"]');
      allCharacterRadios.forEach(radio => {
      radio.closest('div').style.display = 'none';
      radio.closest('div').style.opacity = 0; 
      });

      // 年齢に応じて選択肢を表示
      if (ageValue >= 0 && ageValue <= 4) {
        showCharacterOptions(['hihi_radio', 'cry_radio', 'baby_radio']);
      } else if (ageValue >= 5 && ageValue <= 9) {
        showCharacterOptions(['yancha_radio', 'jyuken_radio', 'tear_radio']);
      } else if (ageValue >= 10 && ageValue <= 17) {
        showCharacterOptions(['hana_radio', 'sports_radio', 'instagirl_radio', 'otaku_radio', 'benkyo_radio', 'h_radio']);
      } else if (ageValue >= 18 && ageValue <= 24) {
        showCharacterOptions(['hiyokko_radio', 'parttimer_radio', 'gal_radio', 'nomoney_radio', 'home_radio', 'guy_radio']);
      } else if (ageValue >= 25 && ageValue <= 34) {
        showCharacterOptions(['jyakuhai_radio', 'salaryman_radio', 'ronpa_radio', 'stress_radio', 'gumble_radio', 'dream_radio']);
      } else if (ageValue >= 35 && ageValue <= 49) {
        showCharacterOptions(['sinkei_radio', 'tufu_radio', 'parents_radio', 'digital_radio', 'copy_radio', 'designer_radio']);
      } else if (ageValue >= 50 && ageValue <= 64) {
        showCharacterOptions(['ogosyo_radio', 'jinji_radio', 'wresler_radio', 'spiritual_radio', 'bukiyo_radio', 'mago_radio']);
      } else if (ageValue >= 65 && ageValue <= 79) {
        showCharacterOptions(['VIP_radio', 'rogo_radio', 'rogan_radio', 'kaigo_radio', 'seki_radio']);
      } else if (ageValue >= 80 && ageValue <= 99) {
        showCharacterOptions(['kioku_radio', 'ill_radio', 'car_radio']);
      } else if (ageValue >= 100 && ageValue <= 116) {
        showCharacterOptions(['sleep_radio', 'tooth_radio', 'heaven_radio']);
     }
    }

    // 特定のラジオボタンを表示する関数
    function showCharacterOptions(characterKeys) {
      characterKeys.forEach(key => {
        const element = document.querySelector(`.${key}`);
        if (element) {
          const closestDiv = element.closest('div');
          closestDiv.style.opacity = 0;
          closestDiv.style.display = 'block'; 
          setTimeout(() => {
            closestDiv.style.transition = 'opacity 0.5s';
            closestDiv.style.opacity = 1;  // フェードイン
          }, 10);
        }
      });
    }
    
    // その他のイベントリスナー
    let enter = document.querySelector('.enter');
    if (enter) {
      enter.addEventListener('input', (event) => {
      });
      enter.addEventListener('click', function() {
        document.querySelector('#description').classList.add('show');
    });
    }
    
    // WebSocketイベント
    ws.addEventListener('open', () => console.log('WebSocket opened'));
    ws.addEventListener('close', () => console.log('WebSocket closed'));
    ws.addEventListener('error', () => console.log('WebSocket error'));
    
    // WebSocketメッセージ受信処理
    ws.addEventListener('message', (message) => {
      if (message.data === 'ping') {
        ws.send('pong');
        return;
      }
    
      let parsedData;
    
      try {
        // シングルクォートをダブルクォートに変換
        const correctedData = message.data.replace(/'/g, '"');
        parsedData = JSON.parse(correctedData);
      } catch (error) {
        console.error("JSON Parse error:", error);
        console.log("Raw data:", message.data);
        return; // パースエラーが発生した場合は処理を終了
      }
    
      // スライダーとラジオボタンの値を更新
      for (let key in parsedData) {
        const element = document.querySelector(`.${key}`);
        if (element) {
          element.value = parsedData[key];
          if (radioKeys.includes(key)) {
            updateRadioValue(element); // ラジオボタンの場合、選択状態を更新
          }
        }
      }
      if (parsedData.description && parsedData.image_url) {
        const descriptionElement = document.querySelector('#description');
        const imageElement = document.querySelector('#image');
    
        if (descriptionElement && imageElement) {
          descriptionElement.innerText = parsedData.description; // 説明文を更新
    
          // 画像URLを更新
          imageElement.src = parsedData.image_url;
    
          // 画像URLが正しい場合に画像を表示
          if (parsedData.image_url) {
            imageElement.style.display = 'block';
          } else {
            imageElement.style.display = 'none'; // 画像URLがない場合は非表示
          }
        }
      }
      console.log(parsedData); // 受信データをコンソールに表示
    });