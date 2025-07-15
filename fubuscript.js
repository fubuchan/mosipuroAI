let ws = new WebSocket('wss://socket-server-template-7yue.onrender.com');

const radioKeys = [
  "none_radio", "health_radio", "power_radio", "athlete_radio",
  "hihi_radio", "cry_radio", "baby_radio", "yancha_radio", "jyuken_radio", "tear_radio",
  "hana_radio", "sports_radio", "instagirl_radio", "otaku_radio", "benkyo_radio", "h_radio",
  "hiyokko_radio", "parttimer_radio", "gal_radio", "nomoney_radio", "home_radio", "guy_radio",
  "jyakuhai_radio", "salaryman_radio", "ronpa_radio", "stress_radio", "gumble_radio", "dream_radio",
  "sinkei_radio", "tufu_radio", "parents_radio", "digital_radio", "copy_radio", "designer_radio",
  "ogosyo_radio", "jinji_radio", "wresler_radio", "spiritual_radio", "bukiyo_radio", "mago_radio",
  "VIP_radio", "rogo_radio", "rogan_radio", "kaigo_radio", "seki_radio", "kioku_radio", "ill_radio",
  "car_radio", "sleep_radio", "tooth_radio", "heaven_radio"
];

function updateRadioValue(radio) {
  const allRadios = document.querySelectorAll(`input[name="${radio.name}"]`);
  allRadios.forEach((r) => {
    if (r !== radio) r.value = "0";
  });
  radio.value = "1";
  console.log(`選択された運動: ${radio.dataset.label}`);
}

function updateRadioValue2(radio) {
  console.log(`選択されたキャラ: ${radio.dataset.label}`);
}

function toggleEnterValue() {
  const button = document.querySelector('.enter');
  const newValue = button.value === "0" ? "1" : "0";
  const age = document.querySelector('.age_slider').value;
  const description = document.getElementById('description');
  const image = document.getElementById('image');
  button.style.display = 'none';
  description.textContent = `${age}歳のあなたにぴったりのプロレス技は...`;
  image.src = "";
  image.style.display = "block";
  button.value = newValue;
  ws.send(JSON.stringify({ enter: newValue }));
}

radioKeys.forEach((key) => {
  const element = document.querySelector(`.${key}`);
  if (element) {
    element.addEventListener('change', () => {
      updateRadioValue(element);
      ws.send(JSON.stringify({ [key]: element.value }));
    });
  }
});

let age_slider = document.querySelector('.age_slider');
if (age_slider) {
  age_slider.addEventListener('change', () => {
    const ageValue = parseInt(age_slider.value);
    updateCharacterOptions(ageValue);
    ws.send(JSON.stringify({ 'slider2': age_slider.value }));
  });
}

function updateCharacterOptions(ageValue) {
  const allCharacterRadios = document.querySelectorAll('input[name="chara"]');
  allCharacterRadios.forEach(radio => {
    radio.closest('div').style.display = 'none';
    radio.closest('div').style.opacity = 0;
  });

  const groups = [
    { range: [0, 4], keys: ["hihi_radio", "cry_radio", "baby_radio"] },
    { range: [5, 9], keys: ["yancha_radio", "jyuken_radio", "tear_radio"] },
    { range: [10, 17], keys: ["hana_radio", "sports_radio", "instagirl_radio", "otaku_radio", "benkyo_radio", "h_radio"] },
    { range: [18, 24], keys: ["hiyokko_radio", "parttimer_radio", "gal_radio", "nomoney_radio", "home_radio", "guy_radio"] },
    { range: [25, 34], keys: ["jyakuhai_radio", "salaryman_radio", "ronpa_radio", "stress_radio", "gumble_radio", "dream_radio"] },
    { range: [35, 49], keys: ["sinkei_radio", "tufu_radio", "parents_radio", "digital_radio", "copy_radio", "designer_radio"] },
    { range: [50, 64], keys: ["ogosyo_radio", "jinji_radio", "wresler_radio", "spiritual_radio", "bukiyo_radio", "mago_radio"] },
    { range: [65, 79], keys: ["VIP_radio", "rogo_radio", "rogan_radio", "kaigo_radio", "seki_radio"] },
    { range: [80, 99], keys: ["kioku_radio", "ill_radio", "car_radio"] },
    { range: [100, 116], keys: ["sleep_radio", "tooth_radio", "heaven_radio"] }
  ];

  for (const group of groups) {
    if (ageValue >= group.range[0] && ageValue <= group.range[1]) {
      showCharacterOptions(group.keys);
      break;
    }
  }
}

function showCharacterOptions(characterKeys) {
  characterKeys.forEach(key => {
    const element = document.querySelector(`.${key}`);
    if (element) {
      const closestDiv = element.closest('div');
      closestDiv.style.opacity = 0;
      closestDiv.style.display = 'block';
      setTimeout(() => {
        closestDiv.style.transition = 'opacity 0.5s';
        closestDiv.style.opacity = 1;
      }, 10);
    }
  });
}

let enter = document.querySelector('.enter');
if (enter) {
  enter.addEventListener('click', () => {
    document.querySelector('#description').classList.add('show');
  });
}

ws.addEventListener('open', () => console.log('WebSocket opened'));
ws.addEventListener('close', () => console.log('WebSocket closed'));
ws.addEventListener('error', () => console.log('WebSocket error'));

ws.addEventListener('message', (message) => {
  if (message.data === 'ping') {
    ws.send('pong');
    return;
  }

  let parsedData;
  try {
    const correctedData = message.data.replace(/'/g, '"');
    parsedData = JSON.parse(correctedData);
  } catch (error) {
    console.error("JSON Parse error:", error);
    console.log("Raw data:", message.data);
    return;
  }

  for (let key in parsedData) {
    const element = document.querySelector(`.${key}`);
    if (element) {
      element.value = parsedData[key];
      if (radioKeys.includes(key)) {
        updateRadioValue(element);
      }
    }
  }

  if (parsedData.description && parsedData.image_url) {
    const descriptionElement = document.querySelector('#description');
    const imageElement = document.querySelector('#image');
    descriptionElement.innerText = parsedData.description;
    imageElement.src = parsedData.image_url;
    imageElement.style.display = parsedData.image_url ? 'block' : 'none';
  }

  console.log(parsedData);
});
