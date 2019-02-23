//1.轮播图
var picj = 0;
var jindex = 1;
var lastPic = 0;
var pointJ = 0;
var lastPoint = 0;
var picTimer = '';
var img = $('div#innerPicwrap ul li');
var point = $('div#point ul li');
img.eq(picj).css('z-index', jindex).css('opacity', '1').css('display','block');
img.filter(':not(:eq(' + picj + '))').css('opacity', '0').css('display','none');
point.eq(pointJ).css('background', '#FF00CC');
point.filter(':not(:eq(' + pointJ + '))').css('background', '#EEEEEE');

//轮播图自动播放
function picRoll() {
	lastPic = picj;
	picj++;
	jindex++
	lastPoint = pointJ;
	pointJ++;
	if(picj >= img.length) {
		picj = 0;
	}
	if(pointJ >= point.length) {
		pointJ = 0;
	}
	img.eq(picj).css('z-index', jindex).css('display','block').animate({
		opacity: 1
	}, 1000, 'linear', function() {
		img.eq(lastPic).css('opacity', '0').css('display','none');
	});
	point.eq(pointJ).animate({}, 1000, 'linear', function() {
		point.eq(pointJ).css('background', '#FF00CC');
		point.eq(lastPoint).css('background', '#EEEEEE');
	});
	picTimer = setTimeout('picRoll()', 3000);
}

picTimer = setTimeout('picRoll()', 3000);

$(function() {
	//点击"上一张"
	var leftc = $('div#leftB');
	leftc.on('click', function() {
		picj = lastPic;
		lastPic--
		jindex++;
		pointJ = lastPoint;
		lastPoint--;
		if(lastPic < 0) {
			lastPic = img.length - 1;
		}
		if(lastPoint < 0) {
			lastPoint = point.length - 1;
		}
		img.eq(picj).css('z-index', jindex).css('display','block').stop().animate({
			opacity: 1
		}, 'fast', 'linear', function() {
			img.filter(':not(:eq(' + picj + '))').css('opacity', '0').css('display','none');
		});
		point.eq(pointJ).stop().animate({}, 'slow', 'fast', function() {
			point.eq(pointJ).css('background', '#FF00CC');
			point.filter(':not(:eq(' + pointJ + '))').css('background', '#EEEEEE');
		});
	});
	//点击"下一张"
	var rightc = $('div#rightB');
	rightc.on('click', function() {
		lastPic = picj;
		picj++;
		jindex++;
		lastPic = pointJ;
		pointJ++;
		if(picj >= img.length) {
			picj = 0;
		}
		if(pointJ >= point.length) {
			pointJ = 0;
		}
		img.eq(picj).css('z-index', jindex).css('display','block').stop().animate({
			opacity: 1
		}, 'fast', 'linear', function() {
			img.filter(':not(:eq(' + picj + '))').css('opacity', '0').css('display','none');
		});
		point.eq(pointJ).stop().animate({}, 'slow', 'fast', function() {
			point.eq(pointJ).css('background', '#FF00CC');
			point.filter(':not(:eq(' + pointJ + '))').css('background', '#EEEEEE');
		});
	});
	//点击“小圆点”
	var pwhich = $('#point ul').find('li');
	pwhich.on('click', function() {
		pwhich.css('background', '#EEEEEE');
		var cpIndex = $(this).index();
		jindex++;
		img.eq(cpIndex).stop().css('z-index', jindex).css('display','block').animate({
				opacity: 1
			},
			'fast', 'linear',
			function() {
				img.filter(':not(:eq(' + cpIndex + '))').css('opacity', '0').css('display','none');
			});

		point.eq(cpIndex).stop().animate({}, 'fast', 'linear', function() {
			point.eq(cpIndex).css('background', '#FF00CC');
			point.filter(':not(:eq(' + cpIndex + '))').css('bakcground', '#EEEEEE');
		});
	});
});

//2.实时搜索功能
var sTxt = $('#search input');
var sBtn = $('#search #btn');
var sList = $('#search #searchList');
var daList = ['约会大作战', '化物语', '赤发白雪姬', '狐妖小红娘', '空之物语', '叛逆性百万亚瑟王', '夏目友人帐', '哥布林杀手', '犬夜叉', '火隐忍者', '斗罗大陆', '新世纪福音战士', '约会', '约出来', '约出'];
//点击按钮
sBtn.on('click', function() {
	var sKeyWord = sTxt.val();
	var ssList = searchByReg(sKeyWord, daList);
	renderList(ssList);
});
//回车查询
sTxt.on('keydown', function(e) {
	if(e.keyCode == 13) {
		var sKeyWord = sTxt.val();
		var ssList = searchByReg(sKeyWord, daList);
		renderList(ssList);
	}
});
var sLock = false;
// 输入汉语拼音时锁住搜索框，不进行搜索，或者从汉语拼音转到字母时也可触发
sTxt.on('compositionstart', function() {
	sLock = true;
	console.log('does not search');
});
//结束汉语拼音输入并生成汉字时，解锁搜索框，进行搜索
sTxt.on('compositionend', function() {
	sLock = false;
	console.log('汉字搜索 ');
	$.ajax({
		type: 'get',
		url: './json/searchList.json',
		async: true,
		success: function(data) {
			var sKeyWord = sTxt.val();
			var ssList = searchByReg(sKeyWord, data);
			renderList(ssList);
		}
	});
});
//字母搜索
sTxt.on('input', function() {
	if(!sLock) {
		console.log('字母搜索');
		$.ajax({
			type: 'get',
			url: './json/searchList.json',
			async: true,
			success: function(data) {
				var sKeyWord = sTxt.val();
				var ssList = searchByReg(sKeyWord, data);
				renderList(ssList);
			}
		});
	}
});
//删除字符串
sTxt.on('keydown', function(e) {
	if(e.keyCode == 8) {
		if(sTxt.val() == '') {
			$('aside #search #searchList').css('opacity', '0');
		}
	}
});
//鼠标移出时搜索列表消失
//$(':not(aside #search)').on('click',function(){
//	var searTimer='';
//	searTimer=setTimeout(function(){
//		sList.css('display','none');
//	},2000);
//});
//正则匹配
function searchByReg(keyWord, list) {
	if(!list instanceof Array) {
		return;
	}
	var len = list.length;
	var arr = [];
	var reg = new RegExp(keyWord);
	for(var i = 0; i < list.length; i++) {
		if(list[i].match(reg)) {
			arr.push(list[i]);
		}
	}
	return arr;
}
//搜索下拉列表生成
function renderList(list) {
	if(!list instanceof Array) {
		return;
	}
	sList.html('');
	sList.css('opacity', '1');
	var len = list.length;
	var item = null;
	for(var i = 0; i < list.length; i++) {
		var itema = $('<a></a>').text(list[i]);
		item = $('<li></li>');
		sList.append(item);
		item.append(itema);
		item.css('opacity', '1');
		itema.attr('href', './html/' + list[i] + '.html?data=' + list[i] + '&num=' + Math.random());
		itema.attr('target','_blank');
	}
}

//3.功能区tabBar悬停切换
//鼠标移入“番剧”按钮
$(function() {
	var tabTimer = '';
	$('#fun .oprea,div#cartoonWrap').mouseover(function() {
		if(tabTimer) {
			clearTimeout(tabTimer);
		}
		$('div#cartoonWrap').css('opacity', '1').css('display', 'block');
		$('div#musicWrap').css('opacity', '0').css('display', 'none');
		$('div#gameWrap').css('opacity', '0').css('display', 'none');
	});
	//鼠标移出“番剧”按钮
	$('#fun .oprea,div#cartoonWrap').mouseout(function() {
		tabTimer = setTimeout(function() {
			$('div#cartoonWrap').css('opacity', '0').css('display', 'none');
			$('div#musicWrap').css('opacity', '1').css('display', 'block');
			$('div#gameWrap').css('opacity', '1').css('display', 'block');
		}, 400);
	});
	//鼠标移入“音乐”按钮
	$('#fun .music,div#musicWrap').mouseover(function() {
		if(tabTimer) {
			clearTimeout(tabTimer);
		}
		$('div#cartoonWrap').css('opacity', '0').css('display', 'none');
		$('div#musicWrap').css('opacity', '1').css('display', 'block');
		$('div#gameWrap').css('opacity', '0').css('display', 'none');
	});
	//鼠标移出“音乐”按钮
	$('#fun .music,div#musicWrap').mouseout(function() {
		tabTimer = setTimeout(function() {
			$('div#cartoonWrap').css('opacity', '1').css('display', 'block');
			$('div#musicWrap').css('opacity', '0').css('display', 'none');
			$('div#gameWrap').css('opacity', '1').css('display', 'block');
		}, 400);
	});
	//鼠标移入“游戏”按钮
	$('#fun .game,div#gameWrap').mouseover(function() {
		if(tabTimer) {
			clearTimeout(tabTimer);
		}
		$('div#cartoonWrap').css('opacity', '0').css('display', 'none');
		$('div#musicWrap').css('opacity', '0').css('display', 'none');
		$('div#gameWrap').css('opacity', '1').css('display', 'block');
	});
	//鼠标移出“游戏”按钮
	$('#fun .game,div#gameWrap').mouseout(function() {
		tabTimer = setTimeout(function() {
			$('div#cartoonWrap').css('opacity', '1').css('display', 'block');
			$('div#musicWrap').css('opacity', '1').css('display', 'block');
			$('div#gameWrap').css('opacity', '0').css('display', 'none');
		}, 400);
	});
});
//4. “番剧”板块的瀑布流显示
$(window).load(function() {
	//AJAX records
	var cRecords = [];
	
	$.ajax({
				type: 'get',
				url: './json/cartoonView.json',
				async: true,
				dataType: 'json',
				success: function(data) {
					cRecords = data;
				}
		 });

	PBL01('cartoonWrap', 'cbox');

	$('#cartoonWrap').scroll(function() {
		//校验数据请求
		if(getCheck('cartoonWrap', 'cbox')) {
			var $wrap = $('#cartoonWrap');
			jQuery.each(cRecords, function(i, item) {
				var str = '<div class="cbox">\
								<div class="cinfo">\
									<div class="cpic"><img src="' + item.src + '"/></div>\
									<div class="ctitle"><a href="#">' + item.title + '</a></div>\
								</div>\
							</div>';
				$wrap.append(str);
			});
			PBL01('cartoonWrap', 'cbox');
		}
	});

});

function PBL01(wrap, box) {
	var $wrap = $('#' + wrap);
	var $boxes = $wrap.find('.' + box);
	//		var boxWidth = $boxes.eq(0).outerWidth(false);
	//	var screenWidth = $(window).width();
	//	var columns = Math.floor(screenWidth / boxWidth);
	var columns = 4;
	//	$wrap.width(boxWidth * columns);
	var everyH = [];
	for(var i = 0; i < $boxes.length; i++) {
		if(i < columns) {
			everyH[i] = $boxes.eq(i).outerHeight(false);
		} else {
			var minH = Math.min.apply(null, everyH);
			var minIndex = getIndex(minH, everyH);
			placeBox($boxes.eq(i), minH, Math.floor($boxes.eq(minIndex).position().left), i);
			everyH[minIndex] += $boxes.eq(i).outerHeight(false);
		}
	}
}

function getIndex(minH, everyH) {
	for(index in everyH) {
		if(everyH[index] == minH) {
			return index;
		}
	}
}

function getCheck(wrap, box) {
	var documentHeight = $('#' + wrap).height();
	var scrollHeight = $('#' + wrap).scrollTop();
	return documentHeight + scrollHeight >= getLastH(wrap, box) ? true : false;
}

function getLastH(wrap, box) {
	var $wrap = $('#' + wrap);
	var $boxes = $wrap.find('.' + box);
	return $boxes.last().position().top + $boxes.last().outerHeight(false);

}

var getStartNum = 0;

function placeBox($box, top, left, index) {
	if(getStartNum >= index) {
		return;
	}
	$box.css({
		'position': 'absolute',
		'top': top,
		'left': left,
		'opacity': '0'
	});

	$box.stop().animate({
		'opacity': '1'
	}, 999);
	getStartNum = index;
}

//5."音乐"\"游戏"版块显示
var mv=new Vue({
	el:'#musicWrap',
	data:{
		mRecord:[],
	},
	mounted(){
		this.mGet();
	},
	methods:{
		 mGet:function(){
		 	axios.get('./json/musicView.json').then(response=>{
				this.mRecord=response.data;
			}).catch(error=>{
				console.log(error);
			});
		 },
	}
});

var gv=new Vue({
	el:'#gameWrap',
	data:{
		mRecord:[],
		gRecord:[]
	},
	mounted(){
		this.gGet();
	},
	methods:{
		 gGet:function(){
		 	axios.get('./json/gameView.json').then(response=>{
				this.gRecord=response.data;
			}).catch(error=>{
				console.log(error);
			});
		 },
	}
});


