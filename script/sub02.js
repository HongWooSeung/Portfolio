$(window).on('beforeunload', function() {
    // 새로고침 직전에 스크롤 위치를 맨 위로 초기화
    $(window).scrollTop(0);
});

$(document).ready(function(){
    
    // 페이지 로드 시 wrap의 위치를 첫 번째 섹션으로 초기화
    $(".wrap").css("transform", "translateY(0)");
    
    // 브라우저의 기본 스크롤 복원 기능 끄기 (가장 중요)
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
	
	//원스크롤
	// 변수명 통일: .wrap을 가리키는 $wrap
    const $wrap = $('.wrap'); 
    
    let currentPage = 0;
    let offsetArray = [];
    let isScrolling = false;

    // 1. 개발자님의 논리: 남은 높이를 계산해 이동 지점을 제한하는 함수
    function setPosition() {
        offsetArray = [];
        const winHeight = $(window).height();
        const wrapHeight = $wrap.outerHeight(); // 전체 wrap의 높이
        const $eachPages = $wrap.find('.pages');
		const finalTop = wrapHeight - winHeight;
        
        $eachPages.each(function(i) {
            const currentTop = $(this).offset().top;
            // [중요 로직] 남은 높이가 화면 높이보다 작으면 바닥에 도달한 것
            const remainingHeight = wrapHeight - currentTop;
			
            if (remainingHeight <= winHeight) {
                // 더 내려가면 공백이 보이므로, '전체높이 - 화면높이'를 마지막 좌표로 고정
                offsetArray.push(finalTop);
                
                // 더 이상의 페이지 인덱스는 의미 없으므로 여기서 중단 (return false)
                return false; 
            } else {
                // 아직 내려갈 공간이 충분하면 해당 페이지의 top을 저장
                offsetArray.push(currentTop);
            }
        });
    }

    $(window).on('resize', function() {
        setPosition();
        // 리사이즈 시 현재 인덱스 위치 유지
        if (offsetArray[currentPage] !== undefined) {
            $('html, body').scrollTop(offsetArray[currentPage]);
        }
    }).trigger('resize');

    // 2. 휠 이벤트 (offsetArray.length 기준으로 작동)
    window.addEventListener('wheel', function(e) {
        const totalValidPages = offsetArray.length; // 유효한 좌표 개수
        const delta = e.deltaY;

        // 위/아래 경계선에서 브라우저 기본 스크롤 허용
        if (delta > 0 && currentPage >= totalValidPages - 1) return;
        if (delta < 0 && currentPage <= 0) return;

        e.preventDefault(); 
        if (isScrolling) return;

        if (delta > 0) currentPage++;
        else currentPage--;

        isScrolling = true;

        $('html, body').stop().animate({
            scrollTop: offsetArray[currentPage]
        }, 600, function() {
            isScrolling = false;
        });
    }, { passive: false });

    
    $('.btn_top').click(function(){
        currentPage = 0;
    });

});