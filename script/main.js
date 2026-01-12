$(document).ready(function(){
	const work = $('.orbit-path-a .works-ban');
	let deg = [-45, -15, 15, 45, 75, 105];

	work.each(function(index, element) {
		let $work = $(element);
		let $parent = $work.parent();
		let $gr_parent = $work.parent().parent(); // 부모인 work_orb를 자동으로 찾음

		setInterval(function() {
			// 1. 각도 계산 로직
			if (deg[index] >= 105) {
				deg[index] = -75;
				$gr_parent.hide(); // 부모를 숨기면 자식도 같이 숨겨짐
			} else {
				$gr_parent.show();
				deg[index] += 1;
			}

			// 2. 부모(work_orb) 회전
			$gr_parent.css({
				'transform': 'rotate(' + deg[index] + 'deg)',
				'transition': 'transform 0.5s linear'
			});

			// 3. 자식(work) 반대 방향 회전 (상대적 수직 유지)
			$parent.css({
				'transform': 'rotate(' + (-deg[index]) + 'deg)',
				'transition': 'transform 0.5s linear'
			});
		}, 100);
	});
	
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
	
	//헤더 슬라이드 메뉴
	
	$('.scrolldw').hover(
		function() {
			$('.scdw-wrap').addClass('active');
		}, 
		function() {
			$('.scdw-wrap').removeClass('active');
		}
	);
	
	//overview페이지 슬라이드 메뉴
	let current_slider = 0;
	let next_slider = 1;
	let prev_slider = 1;
	const $slider = $('.text_slider .img_wrap');
	let isSliding = false;
	let autoTimer; // 타이머를 담을 변수
	
	function next(){
		if (isSliding) return false;
    
		if (current_slider >= $slider.length - 1) next_slider = 0;
		else next_slider = current_slider + 1;
		
		$slider.hide();
		$slider.eq(current_slider).show().css({ left: '0%' });
		$slider.eq(next_slider).show().css({ left: '100%' });

		isSliding = true;
		
		$slider.eq(current_slider).animate({ left: '-100%' }, 500, 'linear', function() {
			isSliding = false;
		});
		
		$slider.eq(next_slider).animate({ left: '0%' }, 500, 'linear');
		
		current_slider = next_slider;
	}
	
	function prev(){
		if(isSliding) return false;
		
		// 0. slider번호 계산
		if(current_slider <= 0) prev_slider = $slider.length-1;
		else prev_slider = current_slider-1;
		
		// 1. 초기 위치 설정 (왼쪽 -50%)
		$slider.hide();
		$slider.eq(current_slider).show().css({ left: '0%' });
		$slider.eq(prev_slider).show().css({ left: '-100%' });

		isSliding = true;
		// 2. 애니메이션 실행 (오른쪽 50% 지점까지)
		$slider.eq(current_slider).animate({
			left: '100%'
		}, 500, 'linear', function() {
				// 3. 애니메이션이 끝나면 다시 처음 위치로 돌아가서 반복 (재귀 호출)
				isSliding = false;
			});
		$slider.eq(prev_slider).show().animate({left: '0%'}, 500, 'linear');
		
		current_slider = prev_slider;
	}
	
	$('.arr_lf').on('click',function(e){
		e.preventDefault();
		
		stopAutoSlide(); // 일단 멈춤
		prev();
		startAutoSlide();
	});
	
	$('.arr_rg').on('click',function(e){
		e.preventDefault();
		
		stopAutoSlide(); // 일단 멈춤
		next();
		startAutoSlide();
	});
	
	//자동 슬라이드
	function startAutoSlide() {
		// 혹시 이미 돌아가고 있을지 모를 타이머를 제거 (중복 실행 방지)
		stopAutoSlide(); 
		autoTimer = setInterval(function() {
			next(); // 5초마다 next 함수 실행
		}, 4000);
	}

	// --- 자동 재생 정지 함수 ---
	function stopAutoSlide() {
		clearInterval(autoTimer);
	}
		
	startAutoSlide();
	
});