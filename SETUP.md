# LibreChat × GIS 연결 가이드

## 1) geo-tool 실행
```bash
cd geo-tool
npm i
npm run dev   # http://localhost:8787
# 확인: http://localhost:8787/ui.html
#       http://localhost:8787/geo/sample
```

## 2) LibreChat에서 아티팩트로 지도 띄우기

* 대화창에 아래 문장을 그대로 입력:

  > "다음 코드를 **아티팩트**로 렌더링해줘. 컴포넌트는 `GisIFrame`이고, 코드는 곧 붙여넣을게."
* 이어서 `artifacts/GisIFrame.tsx` 코드 전부를 붙여넣기
* 기본 src는 `http://host.docker.internal:8787/ui.html?src=/geo/sample`

  * Linux에서는 `http://172.17.0.1:8787/ui.html?src=/geo/sample` 권장

## 3) 데이터/뷰 옵션

* GeoJSON 교체: `?src=/geo/sample` → `?src=http://host.docker.internal:8787/geo/points?bbox=126.8,37.45,127.2,37.7&n=1000`
* 초기 영역(BBOX): `&bbox=minLon,minLat,maxLon,maxLat`
* 외부 WMS(간이 프록시): `http://host.docker.internal:8787/wms?url=${encodeURIComponent(WMS_URL)}`

## 4) 검증 체크리스트

* [ ] `http://localhost:8787/ui.html` 에서 지도가 보인다
* [ ] LibreChat 아티팩트에 IFrame 지도가 렌더된다
* [ ] `src=` 변경 시 GeoJSON 레이어가 바뀐다

## 5) 트러블슈팅

* 아티팩트에서 빈 화면: `src` 도메인 접근가능 여부(CORS/포트) 확인
* Docker 내부에서 호스트 접근 안됨: Mac/Win은 `host.docker.internal`, Linux는 `172.17.0.1`
* 외부 WMS가 CORS 차단: `/wms?url=` 프록시 사용

