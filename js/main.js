const num = 200;
const mask = document.querySelector('aside');
const delay = convertSpeed(mask);
const imgDom = createImgs('figure', num); // 반환된 이미지를 전역변수에 담음
let count = 0;

/*
  => when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images
  document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
  });

  => when the whole page has loaded, including all dependent resources such as stylesheets, scripts, iframes, and images.
  window.onload = (event) => {
    console.log("page is fully loaded");
};
*/
// DOM 객체가 생성된 직후 DOM에 수반되는 소스 자료들을 가져오기 시작
// img 요소는 DOM이 생성이 되어야지 그 이후에 이미지 소스를 불러옴
// img.onload 이벤트를 연결하면 해당 DOM에 수반되는 소스 이미지가 완료되었을 때 호출됨
// video.onloadeddata (영상소스 호출 이벤트)
imgDom.forEach(img => {
    img.onload = () => {
        count++;
        const percent = parseInt((count / 200) * 100);
        mask.querySelector('p').innerHTML = percent + '%';
        mask.querySelector('.bar').style.width = percent + '%';
        if(count == num) {
            console.log('이미지 소스 로딩 완료');
            mask.classList.add('off');
            setTimeout(() => {
                mask.remove();
            }, delay)
        }
    }

    // 해당 이미지 요소에 소스 이미지에 오류가 발생하면 대체 이미지 출력
    img.onerror = (e) => {
        e.target.setAttribute('src', 'img/logo.png');
    }
})

// 마우스 무브 이벤트 연결
window.addEventListener('mousemove', e => matchMove(imgDom, num, e));

// 동적으로 이미지 생성 후 반환 함수
function createImgs(targetEl, num) {
    const wrap = document.querySelector(targetEl);
    let imgHtml = '';

    for(let i=0; i<num; i++) imgHtml += `<img src='img/pic${i}.jpg' />`;
    wrap.innerHTML = imgHtml;

    // let imgUrl = '';
    // for(let i=0; i<200; i++) {
    //     imgUrl = `img/pic${i}.jpg`;
    //     const img = document.createElement('img');
    //     img.setAttribute('src', imgUrl);
    //     wrap.append(img);
    // }

    // forEach로 활용하는 법
    // Array(num).fill().forEach((_, idx) => imgHtml += `<img src='img/pic${idx}.jpg' />`);
    // wrap.innerHTML = imgHtml;

    return wrap.querySelectorAll('img');
}

// 브라우저에서 마우스 포인터를 움직일 때마다 현재 포인터의 가로축 좌표 값 출력
// 마우스가 움직일 때마다 항상 1~200이 찍히는 200분율 변환
// 백분율 구하는 공식 (현재의 수치값 / 전체 수치값) * 100
// 이백분율 구하는 공식 (현재의 수치값 / 전체 수치값) * 200
// 브라우저 폭 구하는 공식 : window.innerWidth (document 화면 안쪽), window.outerWidth (스크롤 포함 window 화면 안쪽)
// 마우스 포인터 위치에 따라 이미지 순서 매칭하는 함수
function matchMove(arrEl, num, e) {
    const positionX = e.clientX;
    const width = window.innerWidth;
    const percent = parseInt((positionX / width) * num);
    // console.log(`percent: ${percent}`);

    arrEl.forEach((img, idx) => {
        // img.style.display = 'none';
        img.style.visibility = 'hidden';
    })

    /* 
        opacity, visibility => repaint 일어나지 않음 
        display => repaint 발생
        가장 성능에 유리한 것은 visibility
    */
    // imgDom[percent].style.display = 'block';
    arrEl[percent].style.visibility = 'visible';

}

function convertSpeed(el) {
    return parseFloat(getComputedStyle(el).transitionDuration) * 1000;
}