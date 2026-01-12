$(document).ready(function(){
    const wrap = document.querySelector(".wrap");
    const sections = document.querySelectorAll("section");
    const totalSections = sections.length;
    let currentIdx = 0;
    let isScrolling = false;

    function moveTo(index) {
        // 1. 범위 제한: 0보다 작거나 마지막 섹션 인덱스보다 크면 중단
        if (index < 0 || index >= totalSections || isScrolling) return;
        
        isScrolling = true;
        currentIdx = index;
        
        // 2. 이동 거리 계산: 전체 높이의 (1/6 * 인덱스) 만큼 위로 이동
        // 섹션 높이가 calc(100% / 6)이므로 정확히 한 섹션씩 이동합니다.
        const moveDistance = (100 / totalSections) * currentIdx;
        wrap.style.transform = `translateY(-${moveDistance}%)`;

        setTimeout(() => {
            isScrolling = false;
        }, 700);
    }

    // 마우스 휠 이벤트
    window.addEventListener("wheel", (e) => {
        e.preventDefault(); 
        if (isScrolling) return;

        if (e.deltaY > 0) {
            moveTo(currentIdx + 1);
        } else {
            moveTo(currentIdx - 1);
        }
    }, { passive: false });

    // 화살표 버튼 이벤트
    document.querySelectorAll(".arrows").forEach((btn) => {
        btn.onclick = (e) => {
            e.preventDefault();
            if (btn.classList.contains("top")) {
                moveTo(currentIdx - 1);
            } else {
                moveTo(currentIdx + 1);
            }
        };
    });
})