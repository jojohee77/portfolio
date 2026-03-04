"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, RotateCcw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { loadSidoList, loadSggList, loadUmdList, loadRegionData, searchRegions, type RegionData } from '@/lib/regions-data'

interface Region {
  code: string
  name: string
  parentCode?: string
}

interface RegionSearchProps {
  selectedRegions: string[]
  onRegionsChange: (regions: string[]) => void
  placeholder?: string
  className?: string
  regionOptions?: any[]
  isLoading?: boolean
}

// API 함수 - 로컬 Next.js API 라우트 사용
// 계층적 지역 데이터 로드 함수
const loadRegionsData = async (parentCode?: string, selectedCity?: string): Promise<Region[]> => {
  try {
    if (!parentCode) {
      // 시도 목록 로드
      console.log('시도 목록 로드 시작...')
      const sidoList = await loadSidoList()
      
      return sidoList.map(sido => ({
        code: sido.name,
        name: sido.name,
        parentCode: undefined
      }))
    } else if (parentCode && !parentCode.includes(' ')) {
      // 시군구 목록 로드 (시도 선택 후)
      console.log('시군구 목록 로드 시작:', parentCode)
      
      // 시도명으로 파일명 찾기
      const sidoList = await loadSidoList()
      const selectedSido = sidoList.find(sido => sido.name === parentCode)
      
      if (!selectedSido) {
        console.warn('시도를 찾을 수 없습니다:', parentCode)
        return []
      }
      
      const sggData = await loadSggList(selectedSido.file)
      
      return sggData.map(region => ({
        code: region.code,
        name: region.sggNm,
        parentCode: region.sidonm
      }))
    } else {
      // 동읍면 목록 로드 (시군구 선택 후)
      console.log('동읍면 목록 로드 시작:', parentCode)
      
      // 현재 선택된 시도명과 시군구명 사용
      const cityName = selectedCity // 이미 시도명이 저장됨
      const districtName = parentCode // 이미 시군구명이 전달됨
      
      if (!cityName) {
        console.warn('시도명을 찾을 수 없습니다:', selectedCity)
        return []
      }
      
      // 시도명으로 파일명 찾기
      const sidoList = await loadSidoList()
      const selectedSido = sidoList.find(sido => sido.name === cityName)
      
      if (!selectedSido) {
        console.warn('시도를 찾을 수 없습니다:', cityName)
        return []
      }
      
      const umdData = await loadUmdList(selectedSido.file, districtName)
      
      return umdData.map(region => ({
        code: region.code,
        name: region.umdNm,
        parentCode: region.sggNm
      }))
    }
  } catch (error) {
    console.error('계층적 지역 데이터 로드 실패:', error)
    return []
  }
}

// 기본 지역 데이터 (API 실패시 사용)
const getDefaultRegionData = (parentCode?: string): Region[] => {
  if (!parentCode) {
    return [
      { code: "11", name: "서울특별시" },
      { code: "26", name: "부산광역시" },
      { code: "27", name: "대구광역시" },
      { code: "28", name: "인천광역시" },
      { code: "29", name: "광주광역시" },
      { code: "30", name: "대전광역시" },
      { code: "31", name: "울산광역시" },
      { code: "36", name: "세종특별자치시" },
      { code: "41", name: "경기도" },
      { code: "42", name: "강원특별자치도" },
      { code: "43", name: "충청북도" },
      { code: "44", name: "충청남도" },
      { code: "45", name: "전북특별자치도" },
      { code: "46", name: "전라남도" },
      { code: "47", name: "경상북도" },
      { code: "48", name: "경상남도" },
      { code: "49", name: "제주특별자치도" },
    ]
  }
  
  // 서울특별시 구
  if (parentCode === "11") {
    return [
      { code: "1101", name: "종로구", parentCode: "11" },
      { code: "1102", name: "중구", parentCode: "11" },
      { code: "1103", name: "용산구", parentCode: "11" },
      { code: "1104", name: "성동구", parentCode: "11" },
      { code: "1105", name: "광진구", parentCode: "11" },
      { code: "1106", name: "동대문구", parentCode: "11" },
      { code: "1107", name: "중랑구", parentCode: "11" },
      { code: "1108", name: "성북구", parentCode: "11" },
      { code: "1109", name: "강북구", parentCode: "11" },
      { code: "1110", name: "도봉구", parentCode: "11" },
      { code: "1111", name: "노원구", parentCode: "11" },
      { code: "1112", name: "은평구", parentCode: "11" },
      { code: "1113", name: "서대문구", parentCode: "11" },
      { code: "1114", name: "마포구", parentCode: "11" },
      { code: "1115", name: "양천구", parentCode: "11" },
      { code: "1116", name: "강서구", parentCode: "11" },
      { code: "1117", name: "구로구", parentCode: "11" },
      { code: "1118", name: "금천구", parentCode: "11" },
      { code: "1119", name: "영등포구", parentCode: "11" },
      { code: "1120", name: "동작구", parentCode: "11" },
      { code: "1121", name: "관악구", parentCode: "11" },
      { code: "1122", name: "서초구", parentCode: "11" },
      { code: "1123", name: "강남구", parentCode: "11" },
      { code: "1124", name: "송파구", parentCode: "11" },
      { code: "1125", name: "강동구", parentCode: "11" },
    ]
  }
  
  // 부산광역시 구/군
  if (parentCode === "26") {
    return [
      { code: "2601", name: "중구", parentCode: "26" },
      { code: "2602", name: "서구", parentCode: "26" },
      { code: "2603", name: "동구", parentCode: "26" },
      { code: "2604", name: "영도구", parentCode: "26" },
      { code: "2605", name: "부산진구", parentCode: "26" },
      { code: "2606", name: "동래구", parentCode: "26" },
      { code: "2607", name: "남구", parentCode: "26" },
      { code: "2608", name: "북구", parentCode: "26" },
      { code: "2609", name: "해운대구", parentCode: "26" },
      { code: "2610", name: "사하구", parentCode: "26" },
      { code: "2611", name: "금정구", parentCode: "26" },
      { code: "2612", name: "강서구", parentCode: "26" },
      { code: "2613", name: "연제구", parentCode: "26" },
      { code: "2614", name: "수영구", parentCode: "26" },
      { code: "2615", name: "사상구", parentCode: "26" },
      { code: "2616", name: "기장군", parentCode: "26" },
    ]
  }
  
  // 대구광역시 구/군
  if (parentCode === "27") {
    return [
      { code: "2701", name: "중구", parentCode: "27" },
      { code: "2702", name: "동구", parentCode: "27" },
      { code: "2703", name: "서구", parentCode: "27" },
      { code: "2704", name: "남구", parentCode: "27" },
      { code: "2705", name: "북구", parentCode: "27" },
      { code: "2706", name: "수성구", parentCode: "27" },
      { code: "2707", name: "달서구", parentCode: "27" },
      { code: "2708", name: "달성군", parentCode: "27" },
    ]
  }
  
  // 인천광역시 구/군
  if (parentCode === "28") {
    return [
      { code: "2801", name: "중구", parentCode: "28" },
      { code: "2802", name: "동구", parentCode: "28" },
      { code: "2803", name: "미추홀구", parentCode: "28" },
      { code: "2804", name: "연수구", parentCode: "28" },
      { code: "2805", name: "남동구", parentCode: "28" },
      { code: "2806", name: "부평구", parentCode: "28" },
      { code: "2807", name: "계양구", parentCode: "28" },
      { code: "2808", name: "서구", parentCode: "28" },
      { code: "2809", name: "강화군", parentCode: "28" },
      { code: "2810", name: "옹진군", parentCode: "28" },
    ]
  }
  
  // 광주광역시 구
  if (parentCode === "29") {
    return [
      { code: "2901", name: "동구", parentCode: "29" },
      { code: "2902", name: "서구", parentCode: "29" },
      { code: "2903", name: "남구", parentCode: "29" },
      { code: "2904", name: "북구", parentCode: "29" },
      { code: "2905", name: "광산구", parentCode: "29" },
    ]
  }
  
  // 대전광역시 구
  if (parentCode === "30") {
    return [
      { code: "3001", name: "동구", parentCode: "30" },
      { code: "3002", name: "중구", parentCode: "30" },
      { code: "3003", name: "서구", parentCode: "30" },
      { code: "3004", name: "유성구", parentCode: "30" },
      { code: "3005", name: "대덕구", parentCode: "30" },
    ]
  }
  
  // 울산광역시 구/군
  if (parentCode === "31") {
    return [
      { code: "3101", name: "중구", parentCode: "31" },
      { code: "3102", name: "남구", parentCode: "31" },
      { code: "3103", name: "동구", parentCode: "31" },
      { code: "3104", name: "북구", parentCode: "31" },
      { code: "3105", name: "울주군", parentCode: "31" },
    ]
  }
  
  // 세종특별자치시
  if (parentCode === "36") {
    return [
      { code: "3601", name: "세종시", parentCode: "36" },
    ]
  }
  
  // 경기도 시/군
  if (parentCode === "41") {
    return [
      { code: "4101", name: "수원시", parentCode: "41" },
      { code: "4102", name: "성남시", parentCode: "41" },
      { code: "4103", name: "의정부시", parentCode: "41" },
      { code: "4104", name: "안양시", parentCode: "41" },
      { code: "4105", name: "부천시", parentCode: "41" },
      { code: "4106", name: "광명시", parentCode: "41" },
      { code: "4107", name: "평택시", parentCode: "41" },
      { code: "4108", name: "과천시", parentCode: "41" },
      { code: "4109", name: "오산시", parentCode: "41" },
      { code: "4110", name: "시흥시", parentCode: "41" },
      { code: "4111", name: "군포시", parentCode: "41" },
      { code: "4112", name: "의왕시", parentCode: "41" },
      { code: "4113", name: "하남시", parentCode: "41" },
      { code: "4114", name: "용인시", parentCode: "41" },
      { code: "4115", name: "파주시", parentCode: "41" },
      { code: "4116", name: "이천시", parentCode: "41" },
      { code: "4117", name: "안성시", parentCode: "41" },
      { code: "4118", name: "김포시", parentCode: "41" },
      { code: "4119", name: "화성시", parentCode: "41" },
      { code: "4120", name: "광주시", parentCode: "41" },
      { code: "4121", name: "여주시", parentCode: "41" },
      { code: "4122", name: "양평군", parentCode: "41" },
      { code: "4123", name: "고양시", parentCode: "41" },
      { code: "4124", name: "동두천시", parentCode: "41" },
      { code: "4125", name: "가평군", parentCode: "41" },
      { code: "4126", name: "연천군", parentCode: "41" },
    ]
  }
  
  // 강원특별자치도 시/군
  if (parentCode === "42") {
    return [
      { code: "4201", name: "춘천시", parentCode: "42" },
      { code: "4202", name: "원주시", parentCode: "42" },
      { code: "4203", name: "강릉시", parentCode: "42" },
      { code: "4204", name: "동해시", parentCode: "42" },
      { code: "4205", name: "태백시", parentCode: "42" },
      { code: "4206", name: "속초시", parentCode: "42" },
      { code: "4207", name: "삼척시", parentCode: "42" },
      { code: "4208", name: "홍천군", parentCode: "42" },
      { code: "4209", name: "횡성군", parentCode: "42" },
      { code: "4210", name: "영월군", parentCode: "42" },
      { code: "4211", name: "평창군", parentCode: "42" },
      { code: "4212", name: "정선군", parentCode: "42" },
      { code: "4213", name: "철원군", parentCode: "42" },
      { code: "4214", name: "화천군", parentCode: "42" },
      { code: "4215", name: "양구군", parentCode: "42" },
      { code: "4216", name: "인제군", parentCode: "42" },
      { code: "4217", name: "고성군", parentCode: "42" },
      { code: "4218", name: "양양군", parentCode: "42" },
    ]
  }
  
  // 충청북도 시/군
  if (parentCode === "43") {
    return [
      { code: "4301", name: "청주시", parentCode: "43" },
      { code: "4302", name: "충주시", parentCode: "43" },
      { code: "4303", name: "제천시", parentCode: "43" },
      { code: "4304", name: "보은군", parentCode: "43" },
      { code: "4305", name: "옥천군", parentCode: "43" },
      { code: "4306", name: "영동군", parentCode: "43" },
      { code: "4307", name: "증평군", parentCode: "43" },
      { code: "4308", name: "진천군", parentCode: "43" },
      { code: "4309", name: "괴산군", parentCode: "43" },
      { code: "4310", name: "음성군", parentCode: "43" },
      { code: "4311", name: "단양군", parentCode: "43" },
    ]
  }
  
  // 충청남도 시/군
  if (parentCode === "44") {
    return [
      { code: "4401", name: "천안시", parentCode: "44" },
      { code: "4402", name: "공주시", parentCode: "44" },
      { code: "4403", name: "보령시", parentCode: "44" },
      { code: "4404", name: "아산시", parentCode: "44" },
      { code: "4405", name: "서산시", parentCode: "44" },
      { code: "4406", name: "논산시", parentCode: "44" },
      { code: "4407", name: "계룡시", parentCode: "44" },
      { code: "4408", name: "당진시", parentCode: "44" },
      { code: "4409", name: "금산군", parentCode: "44" },
      { code: "4410", name: "부여군", parentCode: "44" },
      { code: "4411", name: "서천군", parentCode: "44" },
      { code: "4412", name: "청양군", parentCode: "44" },
      { code: "4413", name: "홍성군", parentCode: "44" },
      { code: "4414", name: "예산군", parentCode: "44" },
      { code: "4415", name: "태안군", parentCode: "44" },
    ]
  }
  
  // 전북특별자치도 시/군
  if (parentCode === "45") {
    return [
      { code: "4501", name: "전주시", parentCode: "45" },
      { code: "4502", name: "군산시", parentCode: "45" },
      { code: "4503", name: "익산시", parentCode: "45" },
      { code: "4504", name: "정읍시", parentCode: "45" },
      { code: "4505", name: "남원시", parentCode: "45" },
      { code: "4506", name: "김제시", parentCode: "45" },
      { code: "4507", name: "완주군", parentCode: "45" },
      { code: "4508", name: "진안군", parentCode: "45" },
      { code: "4509", name: "무주군", parentCode: "45" },
      { code: "4510", name: "장수군", parentCode: "45" },
      { code: "4511", name: "임실군", parentCode: "45" },
      { code: "4512", name: "순창군", parentCode: "45" },
      { code: "4513", name: "고창군", parentCode: "45" },
      { code: "4514", name: "부안군", parentCode: "45" },
    ]
  }
  
  // 전라남도 시/군
  if (parentCode === "46") {
    return [
      { code: "4601", name: "목포시", parentCode: "46" },
      { code: "4602", name: "여수시", parentCode: "46" },
      { code: "4603", name: "순천시", parentCode: "46" },
      { code: "4604", name: "나주시", parentCode: "46" },
      { code: "4605", name: "광양시", parentCode: "46" },
      { code: "4606", name: "담양군", parentCode: "46" },
      { code: "4607", name: "곡성군", parentCode: "46" },
      { code: "4608", name: "구례군", parentCode: "46" },
      { code: "4609", name: "고흥군", parentCode: "46" },
      { code: "4610", name: "보성군", parentCode: "46" },
      { code: "4611", name: "화순군", parentCode: "46" },
      { code: "4612", name: "장흥군", parentCode: "46" },
      { code: "4613", name: "강진군", parentCode: "46" },
      { code: "4614", name: "해남군", parentCode: "46" },
      { code: "4615", name: "영암군", parentCode: "46" },
      { code: "4616", name: "무안군", parentCode: "46" },
      { code: "4617", name: "함평군", parentCode: "46" },
      { code: "4618", name: "영광군", parentCode: "46" },
      { code: "4619", name: "장성군", parentCode: "46" },
      { code: "4620", name: "완도군", parentCode: "46" },
      { code: "4621", name: "진도군", parentCode: "46" },
      { code: "4622", name: "신안군", parentCode: "46" },
    ]
  }
  
  // 경상북도 시/군
  if (parentCode === "47") {
    return [
      { code: "4701", name: "포항시", parentCode: "47" },
      { code: "4702", name: "경주시", parentCode: "47" },
      { code: "4703", name: "김천시", parentCode: "47" },
      { code: "4704", name: "안동시", parentCode: "47" },
      { code: "4705", name: "구미시", parentCode: "47" },
      { code: "4706", name: "영주시", parentCode: "47" },
      { code: "4707", name: "영천시", parentCode: "47" },
      { code: "4708", name: "상주시", parentCode: "47" },
      { code: "4709", name: "문경시", parentCode: "47" },
      { code: "4710", name: "경산시", parentCode: "47" },
      { code: "4711", name: "군위군", parentCode: "47" },
      { code: "4712", name: "의성군", parentCode: "47" },
      { code: "4713", name: "청송군", parentCode: "47" },
      { code: "4714", name: "영양군", parentCode: "47" },
      { code: "4715", name: "영덕군", parentCode: "47" },
      { code: "4716", name: "청도군", parentCode: "47" },
      { code: "4717", name: "고령군", parentCode: "47" },
      { code: "4718", name: "성주군", parentCode: "47" },
      { code: "4719", name: "칠곡군", parentCode: "47" },
      { code: "4720", name: "예천군", parentCode: "47" },
      { code: "4721", name: "봉화군", parentCode: "47" },
      { code: "4722", name: "울진군", parentCode: "47" },
      { code: "4723", name: "울릉군", parentCode: "47" },
    ]
  }
  
  // 경상남도 시/군
  if (parentCode === "48") {
    return [
      { code: "4801", name: "창원시", parentCode: "48" },
      { code: "4802", name: "진주시", parentCode: "48" },
      { code: "4803", name: "통영시", parentCode: "48" },
      { code: "4804", name: "사천시", parentCode: "48" },
      { code: "4805", name: "김해시", parentCode: "48" },
      { code: "4806", name: "밀양시", parentCode: "48" },
      { code: "4807", name: "거제시", parentCode: "48" },
      { code: "4808", name: "양산시", parentCode: "48" },
      { code: "4809", name: "의령군", parentCode: "48" },
      { code: "4810", name: "함안군", parentCode: "48" },
      { code: "4811", name: "창녕군", parentCode: "48" },
      { code: "4812", name: "고성군", parentCode: "48" },
      { code: "4813", name: "남해군", parentCode: "48" },
      { code: "4814", name: "하동군", parentCode: "48" },
      { code: "4815", name: "산청군", parentCode: "48" },
      { code: "4816", name: "함양군", parentCode: "48" },
      { code: "4817", name: "거창군", parentCode: "48" },
      { code: "4818", name: "합천군", parentCode: "48" },
    ]
  }
  
  // 제주특별자치도 시/군
  if (parentCode === "49") {
    return [
      { code: "4901", name: "제주시", parentCode: "49" },
      { code: "4902", name: "서귀포시", parentCode: "49" },
    ]
  }
  
  // 동/읍/면 데이터 (전국 주요 지역)
  if (parentCode === "1101") {
    return [
      { code: "110101", name: "청운효자동", parentCode: "1101" },
      { code: "110102", name: "사직동", parentCode: "1101" },
      { code: "110103", name: "삼청동", parentCode: "1101" },
      { code: "110104", name: "부암동", parentCode: "1101" },
      { code: "110105", name: "평창동", parentCode: "1101" },
      { code: "110106", name: "무악동", parentCode: "1101" },
      { code: "110107", name: "교남동", parentCode: "1101" },
      { code: "110108", name: "가회동", parentCode: "1101" },
      { code: "110109", name: "종로1.2.3.4가동", parentCode: "1101" },
      { code: "110110", name: "종로5.6가동", parentCode: "1101" },
      { code: "110111", name: "이화동", parentCode: "1101" },
      { code: "110112", name: "혜화동", parentCode: "1101" },
      { code: "110113", name: "명륜3가동", parentCode: "1101" },
      { code: "110114", name: "와룡동", parentCode: "1101" },
      { code: "110115", name: "숭인1동", parentCode: "1101" },
      { code: "110116", name: "숭인2동", parentCode: "1101" },
    ]
  }
  
  if (parentCode === "1102") {
    return [
      { code: "110201", name: "소공동", parentCode: "1102" },
      { code: "110202", name: "회현동", parentCode: "1102" },
      { code: "110203", name: "명동", parentCode: "1102" },
      { code: "110204", name: "필동", parentCode: "1102" },
      { code: "110205", name: "장충동", parentCode: "1102" },
      { code: "110206", name: "광희동", parentCode: "1102" },
      { code: "110207", name: "을지로동", parentCode: "1102" },
      { code: "110208", name: "신당동", parentCode: "1102" },
      { code: "110209", name: "다산동", parentCode: "1102" },
      { code: "110210", name: "약수동", parentCode: "1102" },
      { code: "110211", name: "청구동", parentCode: "1102" },
      { code: "110212", name: "신당5동", parentCode: "1102" },
      { code: "110213", name: "동화동", parentCode: "1102" },
      { code: "110214", name: "황학동", parentCode: "1102" },
      { code: "110215", name: "중림동", parentCode: "1102" },
    ]
  }
  
  if (parentCode === "1103") {
    return [
      { code: "110301", name: "후암동", parentCode: "1103" },
      { code: "110302", name: "용산2가동", parentCode: "1103" },
      { code: "110303", name: "남영동", parentCode: "1103" },
      { code: "110304", name: "청파동", parentCode: "1103" },
      { code: "110305", name: "원효로1동", parentCode: "1103" },
      { code: "110306", name: "원효로2동", parentCode: "1103" },
      { code: "110307", name: "효창동", parentCode: "1103" },
      { code: "110308", name: "용문동", parentCode: "1103" },
      { code: "110309", name: "한강로동", parentCode: "1103" },
      { code: "110310", name: "이촌1동", parentCode: "1103" },
      { code: "110311", name: "이촌2동", parentCode: "1103" },
      { code: "110312", name: "이태원1동", parentCode: "1103" },
      { code: "110313", name: "이태원2동", parentCode: "1103" },
      { code: "110314", name: "한남동", parentCode: "1103" },
      { code: "110315", name: "서빙고동", parentCode: "1103" },
      { code: "110316", name: "보광동", parentCode: "1103" },
    ]
  }
  
  if (parentCode === "1104") {
    return [
      { code: "110401", name: "왕십리도선동", parentCode: "1104" },
      { code: "110402", name: "마장동", parentCode: "1104" },
      { code: "110403", name: "사근동", parentCode: "1104" },
      { code: "110404", name: "행당1동", parentCode: "1104" },
      { code: "110405", name: "행당2동", parentCode: "1104" },
      { code: "110406", name: "응봉동", parentCode: "1104" },
      { code: "110407", name: "금호1가동", parentCode: "1104" },
      { code: "110408", name: "금호2.3가동", parentCode: "1104" },
      { code: "110409", name: "금호4가동", parentCode: "1104" },
      { code: "110410", name: "옥수동", parentCode: "1104" },
      { code: "110411", name: "성수1가1동", parentCode: "1104" },
      { code: "110412", name: "성수1가2동", parentCode: "1104" },
      { code: "110413", name: "성수2가1동", parentCode: "1104" },
      { code: "110414", name: "성수2가3동", parentCode: "1104" },
      { code: "110415", name: "송정동", parentCode: "1104" },
      { code: "110416", name: "용답동", parentCode: "1104" },
    ]
  }
  
  if (parentCode === "1105") {
    return [
      { code: "110501", name: "중곡1동", parentCode: "1105" },
      { code: "110502", name: "중곡2동", parentCode: "1105" },
      { code: "110503", name: "중곡3동", parentCode: "1105" },
      { code: "110504", name: "중곡4동", parentCode: "1105" },
      { code: "110505", name: "능동", parentCode: "1105" },
      { code: "110506", name: "구의1동", parentCode: "1105" },
      { code: "110507", name: "구의2동", parentCode: "1105" },
      { code: "110508", name: "구의3동", parentCode: "1105" },
      { code: "110509", name: "광장동", parentCode: "1105" },
      { code: "110510", name: "자양1동", parentCode: "1105" },
      { code: "110511", name: "자양2동", parentCode: "1105" },
      { code: "110512", name: "자양3동", parentCode: "1105" },
      { code: "110513", name: "자양4동", parentCode: "1105" },
      { code: "110514", name: "화양동", parentCode: "1105" },
    ]
  }
  
  if (parentCode === "1106") {
    return [
      { code: "110601", name: "용신동", parentCode: "1106" },
      { code: "110602", name: "제기동", parentCode: "1106" },
      { code: "110603", name: "전농1동", parentCode: "1106" },
      { code: "110604", name: "전농2동", parentCode: "1106" },
      { code: "110605", name: "답십리1동", parentCode: "1106" },
      { code: "110606", name: "답십리2동", parentCode: "1106" },
      { code: "110607", name: "장안1동", parentCode: "1106" },
      { code: "110608", name: "장안2동", parentCode: "1106" },
      { code: "110609", name: "청량리동", parentCode: "1106" },
      { code: "110610", name: "회기동", parentCode: "1106" },
      { code: "110611", name: "휘경1동", parentCode: "1106" },
      { code: "110612", name: "휘경2동", parentCode: "1106" },
      { code: "110613", name: "이문1동", parentCode: "1106" },
      { code: "110614", name: "이문2동", parentCode: "1106" },
    ]
  }
  
  if (parentCode === "1107") {
    return [
      { code: "110701", name: "면목본동", parentCode: "1107" },
      { code: "110702", name: "면목2동", parentCode: "1107" },
      { code: "110703", name: "면목3.8동", parentCode: "1107" },
      { code: "110704", name: "면목4동", parentCode: "1107" },
      { code: "110705", name: "면목5동", parentCode: "1107" },
      { code: "110706", name: "면목7동", parentCode: "1107" },
      { code: "110707", name: "상봉1동", parentCode: "1107" },
      { code: "110708", name: "상봉2동", parentCode: "1107" },
      { code: "110709", name: "중화1동", parentCode: "1107" },
      { code: "110710", name: "중화2동", parentCode: "1107" },
      { code: "110711", name: "묵1동", parentCode: "1107" },
      { code: "110712", name: "묵2동", parentCode: "1107" },
      { code: "110713", name: "망우본동", parentCode: "1107" },
      { code: "110714", name: "망우3동", parentCode: "1107" },
      { code: "110715", name: "신내1동", parentCode: "1107" },
      { code: "110716", name: "신내2동", parentCode: "1107" },
    ]
  }
  
  if (parentCode === "1108") {
    return [
      { code: "110801", name: "성북동", parentCode: "1108" },
      { code: "110802", name: "삼선동", parentCode: "1108" },
      { code: "110803", name: "동선동", parentCode: "1108" },
      { code: "110804", name: "돈암1동", parentCode: "1108" },
      { code: "110805", name: "돈암2동", parentCode: "1108" },
      { code: "110806", name: "안암동", parentCode: "1108" },
      { code: "110807", name: "보문동", parentCode: "1108" },
      { code: "110808", name: "정릉1동", parentCode: "1108" },
      { code: "110809", name: "정릉2동", parentCode: "1108" },
      { code: "110810", name: "정릉3동", parentCode: "1108" },
      { code: "110811", name: "정릉4동", parentCode: "1108" },
      { code: "110812", name: "길음1동", parentCode: "1108" },
      { code: "110813", name: "길음2동", parentCode: "1108" },
      { code: "110814", name: "종암동", parentCode: "1108" },
      { code: "110815", name: "하월곡동", parentCode: "1108" },
      { code: "110816", name: "상월곡동", parentCode: "1108" },
      { code: "110817", name: "장위1동", parentCode: "1108" },
      { code: "110818", name: "장위2동", parentCode: "1108" },
      { code: "110819", name: "장위3동", parentCode: "1108" },
      { code: "110820", name: "석관동", parentCode: "1108" },
    ]
  }
  
  if (parentCode === "1109") {
    return [
      { code: "110901", name: "삼양동", parentCode: "1109" },
      { code: "110902", name: "미아동", parentCode: "1109" },
      { code: "110903", name: "번1동", parentCode: "1109" },
      { code: "110904", name: "번2동", parentCode: "1109" },
      { code: "110905", name: "번3동", parentCode: "1109" },
      { code: "110906", name: "수유1동", parentCode: "1109" },
      { code: "110907", name: "수유2동", parentCode: "1109" },
      { code: "110908", name: "수유3동", parentCode: "1109" },
      { code: "110909", name: "우이동", parentCode: "1109" },
      { code: "110910", name: "인수동", parentCode: "1109" },
    ]
  }
  
  if (parentCode === "1110") {
    return [
      { code: "111001", name: "쌍문1동", parentCode: "1110" },
      { code: "111002", name: "쌍문2동", parentCode: "1110" },
      { code: "111003", name: "쌍문3동", parentCode: "1110" },
      { code: "111004", name: "쌍문4동", parentCode: "1110" },
      { code: "111005", name: "방학1동", parentCode: "1110" },
      { code: "111006", name: "방학2동", parentCode: "1110" },
      { code: "111007", name: "방학3동", parentCode: "1110" },
      { code: "111008", name: "창1동", parentCode: "1110" },
      { code: "111009", name: "창2동", parentCode: "1110" },
      { code: "111010", name: "창3동", parentCode: "1110" },
      { code: "111011", name: "창4동", parentCode: "1110" },
      { code: "111012", name: "창5동", parentCode: "1110" },
      { code: "111013", name: "도봉1동", parentCode: "1110" },
      { code: "111014", name: "도봉2동", parentCode: "1110" },
    ]
  }
  
  if (parentCode === "1111") {
    return [
      { code: "111101", name: "월계1동", parentCode: "1111" },
      { code: "111102", name: "월계2동", parentCode: "1111" },
      { code: "111103", name: "월계3동", parentCode: "1111" },
      { code: "111104", name: "공릉1동", parentCode: "1111" },
      { code: "111105", name: "공릉2동", parentCode: "1111" },
      { code: "111106", name: "하계1동", parentCode: "1111" },
      { code: "111107", name: "하계2동", parentCode: "1111" },
      { code: "111108", name: "중계본동", parentCode: "1111" },
      { code: "111109", name: "중계1동", parentCode: "1111" },
      { code: "111110", name: "중계2.3동", parentCode: "1111" },
      { code: "111111", name: "중계4동", parentCode: "1111" },
      { code: "111112", name: "상계1동", parentCode: "1111" },
      { code: "111113", name: "상계2동", parentCode: "1111" },
      { code: "111114", name: "상계3.4동", parentCode: "1111" },
      { code: "111115", name: "상계5동", parentCode: "1111" },
      { code: "111116", name: "상계6.7동", parentCode: "1111" },
      { code: "111117", name: "상계8동", parentCode: "1111" },
      { code: "111118", name: "상계9동", parentCode: "1111" },
      { code: "111119", name: "상계10동", parentCode: "1111" },
    ]
  }
  
  if (parentCode === "1112") {
    return [
      { code: "111201", name: "녹번동", parentCode: "1112" },
      { code: "111202", name: "불광1동", parentCode: "1112" },
      { code: "111203", name: "불광2동", parentCode: "1112" },
      { code: "111204", name: "갈현1동", parentCode: "1112" },
      { code: "111205", name: "갈현2동", parentCode: "1112" },
      { code: "111206", name: "구산동", parentCode: "1112" },
      { code: "111207", name: "대조동", parentCode: "1112" },
      { code: "111208", name: "응암1동", parentCode: "1112" },
      { code: "111209", name: "응암2동", parentCode: "1112" },
      { code: "111210", name: "응암3동", parentCode: "1112" },
      { code: "111211", name: "역촌동", parentCode: "1112" },
      { code: "111212", name: "신사1동", parentCode: "1112" },
      { code: "111213", name: "신사2동", parentCode: "1112" },
      { code: "111214", name: "증산동", parentCode: "1112" },
      { code: "111215", name: "수색동", parentCode: "1112" },
    ]
  }
  
  if (parentCode === "1113") {
    return [
      { code: "111301", name: "천연동", parentCode: "1113" },
      { code: "111302", name: "신촌동", parentCode: "1113" },
      { code: "111303", name: "연희동", parentCode: "1113" },
      { code: "111304", name: "충현동", parentCode: "1113" },
      { code: "111305", name: "북아현동", parentCode: "1113" },
      { code: "111306", name: "신현동", parentCode: "1113" },
      { code: "111307", name: "창천동", parentCode: "1113" },
      { code: "111308", name: "대신동", parentCode: "1113" },
      { code: "111309", name: "대현동", parentCode: "1113" },
      { code: "111310", name: "신수동", parentCode: "1113" },
      { code: "111311", name: "응암동", parentCode: "1113" },
      { code: "111312", name: "홍은1동", parentCode: "1113" },
      { code: "111313", name: "홍은2동", parentCode: "1113" },
      { code: "111314", name: "홍제1동", parentCode: "1113" },
      { code: "111315", name: "홍제2동", parentCode: "1113" },
      { code: "111316", name: "홍제3동", parentCode: "1113" },
      { code: "111317", name: "홍제4동", parentCode: "1113" },
      { code: "111318", name: "홍제5동", parentCode: "1113" },
    ]
  }
  
  if (parentCode === "1114") {
    return [
      { code: "111401", name: "공덕동", parentCode: "1114" },
      { code: "111402", name: "아현동", parentCode: "1114" },
      { code: "111403", name: "도화동", parentCode: "1114" },
      { code: "111404", name: "용강동", parentCode: "1114" },
      { code: "111405", name: "대흥동", parentCode: "1114" },
      { code: "111406", name: "염리동", parentCode: "1114" },
      { code: "111407", name: "신수동", parentCode: "1114" },
      { code: "111408", name: "서강동", parentCode: "1114" },
      { code: "111409", name: "서교동", parentCode: "1114" },
      { code: "111410", name: "합정동", parentCode: "1114" },
      { code: "111411", name: "망원1동", parentCode: "1114" },
      { code: "111412", name: "망원2동", parentCode: "1114" },
      { code: "111413", name: "연남동", parentCode: "1114" },
      { code: "111414", name: "성산1동", parentCode: "1114" },
      { code: "111415", name: "성산2동", parentCode: "1114" },
      { code: "111416", name: "상암동", parentCode: "1114" },
    ]
  }
  
  if (parentCode === "1115") {
    return [
      { code: "111501", name: "목1동", parentCode: "1115" },
      { code: "111502", name: "목2동", parentCode: "1115" },
      { code: "111503", name: "목3동", parentCode: "1115" },
      { code: "111504", name: "목4동", parentCode: "1115" },
      { code: "111505", name: "목5동", parentCode: "1115" },
      { code: "111506", name: "신월1동", parentCode: "1115" },
      { code: "111507", name: "신월2동", parentCode: "1115" },
      { code: "111508", name: "신월3동", parentCode: "1115" },
      { code: "111509", name: "신월4동", parentCode: "1115" },
      { code: "111510", name: "신월5동", parentCode: "1115" },
      { code: "111511", name: "신월6동", parentCode: "1115" },
      { code: "111512", name: "신월7동", parentCode: "1115" },
      { code: "111513", name: "신정1동", parentCode: "1115" },
      { code: "111514", name: "신정2동", parentCode: "1115" },
      { code: "111515", name: "신정3동", parentCode: "1115" },
      { code: "111516", name: "신정4동", parentCode: "1115" },
      { code: "111517", name: "신정6동", parentCode: "1115" },
      { code: "111518", name: "신정7동", parentCode: "1115" },
    ]
  }
  
  if (parentCode === "1116") {
    return [
      { code: "111601", name: "염창동", parentCode: "1116" },
      { code: "111602", name: "등촌1동", parentCode: "1116" },
      { code: "111603", name: "등촌2동", parentCode: "1116" },
      { code: "111604", name: "등촌3동", parentCode: "1116" },
      { code: "111605", name: "화곡본동", parentCode: "1116" },
      { code: "111606", name: "화곡1동", parentCode: "1116" },
      { code: "111607", name: "화곡2동", parentCode: "1116" },
      { code: "111608", name: "화곡3동", parentCode: "1116" },
      { code: "111609", name: "화곡4동", parentCode: "1116" },
      { code: "111610", name: "화곡6동", parentCode: "1116" },
      { code: "111611", name: "화곡8동", parentCode: "1116" },
      { code: "111612", name: "가양1동", parentCode: "1116" },
      { code: "111613", name: "가양2동", parentCode: "1116" },
      { code: "111614", name: "가양3동", parentCode: "1116" },
      { code: "111615", name: "공항동", parentCode: "1116" },
      { code: "111616", name: "방화1동", parentCode: "1116" },
      { code: "111617", name: "방화2동", parentCode: "1116" },
      { code: "111618", name: "방화3동", parentCode: "1116" },
    ]
  }
  
  if (parentCode === "1117") {
    return [
      { code: "111701", name: "구로동", parentCode: "1117" },
      { code: "111702", name: "가리봉동", parentCode: "1117" },
      { code: "111703", name: "신도림동", parentCode: "1117" },
      { code: "111704", name: "고척동", parentCode: "1117" },
      { code: "111705", name: "개봉동", parentCode: "1117" },
      { code: "111706", name: "오류동", parentCode: "1117" },
      { code: "111707", name: "천왕동", parentCode: "1117" },
      { code: "111708", name: "항동", parentCode: "1117" },
      { code: "111709", name: "온수동", parentCode: "1117" },
      { code: "111710", name: "궁동", parentCode: "1117" },
    ]
  }
  
  if (parentCode === "1118") {
    return [
      { code: "111801", name: "가산동", parentCode: "1118" },
      { code: "111802", name: "독산1동", parentCode: "1118" },
      { code: "111803", name: "독산2동", parentCode: "1118" },
      { code: "111804", name: "독산3동", parentCode: "1118" },
      { code: "111805", name: "독산4동", parentCode: "1118" },
      { code: "111806", name: "시흥1동", parentCode: "1118" },
      { code: "111807", name: "시흥2동", parentCode: "1118" },
      { code: "111808", name: "시흥3동", parentCode: "1118" },
      { code: "111809", name: "시흥4동", parentCode: "1118" },
      { code: "111810", name: "시흥5동", parentCode: "1118" },
    ]
  }
  
  if (parentCode === "1119") {
    return [
      { code: "111901", name: "영등포본동", parentCode: "1119" },
      { code: "111902", name: "영등포동", parentCode: "1119" },
      { code: "111903", name: "여의동", parentCode: "1119" },
      { code: "111904", name: "당산1동", parentCode: "1119" },
      { code: "111905", name: "당산2동", parentCode: "1119" },
      { code: "111906", name: "도림동", parentCode: "1119" },
      { code: "111907", name: "문래동", parentCode: "1119" },
      { code: "111908", name: "양평1동", parentCode: "1119" },
      { code: "111909", name: "양평2동", parentCode: "1119" },
      { code: "111910", name: "신길1동", parentCode: "1119" },
      { code: "111911", name: "신길3동", parentCode: "1119" },
      { code: "111912", name: "신길4동", parentCode: "1119" },
      { code: "111913", name: "신길5동", parentCode: "1119" },
      { code: "111914", name: "신길6동", parentCode: "1119" },
      { code: "111915", name: "신길7동", parentCode: "1119" },
      { code: "111916", name: "대림1동", parentCode: "1119" },
      { code: "111917", name: "대림2동", parentCode: "1119" },
      { code: "111918", name: "대림3동", parentCode: "1119" },
    ]
  }
  
  if (parentCode === "1120") {
    return [
      { code: "112001", name: "노량진1동", parentCode: "1120" },
      { code: "112002", name: "노량진2동", parentCode: "1120" },
      { code: "112003", name: "상도1동", parentCode: "1120" },
      { code: "112004", name: "상도2동", parentCode: "1120" },
      { code: "112005", name: "상도3동", parentCode: "1120" },
      { code: "112006", name: "상도4동", parentCode: "1120" },
      { code: "112007", name: "본동", parentCode: "1120" },
      { code: "112008", name: "흑석동", parentCode: "1120" },
      { code: "112009", name: "사당1동", parentCode: "1120" },
      { code: "112010", name: "사당2동", parentCode: "1120" },
      { code: "112011", name: "사당3동", parentCode: "1120" },
      { code: "112012", name: "사당4동", parentCode: "1120" },
      { code: "112013", name: "사당5동", parentCode: "1120" },
      { code: "112014", name: "대방동", parentCode: "1120" },
      { code: "112015", name: "신대방1동", parentCode: "1120" },
      { code: "112016", name: "신대방2동", parentCode: "1120" },
    ]
  }
  
  if (parentCode === "1121") {
    return [
      { code: "112101", name: "봉천본동", parentCode: "1121" },
      { code: "112102", name: "봉천1동", parentCode: "1121" },
      { code: "112103", name: "봉천2동", parentCode: "1121" },
      { code: "112104", name: "봉천3동", parentCode: "1121" },
      { code: "112105", name: "봉천4동", parentCode: "1121" },
      { code: "112106", name: "봉천5동", parentCode: "1121" },
      { code: "112107", name: "봉천6동", parentCode: "1121" },
      { code: "112108", name: "봉천7동", parentCode: "1121" },
      { code: "112109", name: "봉천8동", parentCode: "1121" },
      { code: "112110", name: "봉천9동", parentCode: "1121" },
      { code: "112111", name: "봉천10동", parentCode: "1121" },
      { code: "112112", name: "봉천11동", parentCode: "1121" },
      { code: "112113", name: "신림동", parentCode: "1121" },
      { code: "112114", name: "신사동", parentCode: "1121" },
      { code: "112115", name: "신원동", parentCode: "1121" },
      { code: "112116", name: "서원동", parentCode: "1121" },
      { code: "112117", name: "삼성동", parentCode: "1121" },
      { code: "112118", name: "미성동", parentCode: "1121" },
      { code: "112119", name: "난곡동", parentCode: "1121" },
      { code: "112120", name: "난향동", parentCode: "1121" },
      { code: "112121", name: "조원동", parentCode: "1121" },
    ]
  }
  
  if (parentCode === "1122") {
    return [
      { code: "112201", name: "서초1동", parentCode: "1122" },
      { code: "112202", name: "서초2동", parentCode: "1122" },
      { code: "112203", name: "서초3동", parentCode: "1122" },
      { code: "112204", name: "서초4동", parentCode: "1122" },
      { code: "112205", name: "잠원동", parentCode: "1122" },
      { code: "112206", name: "반포본동", parentCode: "1122" },
      { code: "112207", name: "반포1동", parentCode: "1122" },
      { code: "112208", name: "반포2동", parentCode: "1122" },
      { code: "112209", name: "반포3동", parentCode: "1122" },
      { code: "112210", name: "반포4동", parentCode: "1122" },
      { code: "112211", name: "방배본동", parentCode: "1122" },
      { code: "112212", name: "방배1동", parentCode: "1122" },
      { code: "112213", name: "방배2동", parentCode: "1122" },
      { code: "112214", name: "방배3동", parentCode: "1122" },
      { code: "112215", name: "방배4동", parentCode: "1122" },
      { code: "112216", name: "양재1동", parentCode: "1122" },
      { code: "112217", name: "양재2동", parentCode: "1122" },
      { code: "112218", name: "내곡동", parentCode: "1122" },
    ]
  }
  
  if (parentCode === "1123") {
    return [
      { code: "112301", name: "신사동", parentCode: "1123" },
      { code: "112302", name: "논현1동", parentCode: "1123" },
      { code: "112303", name: "논현2동", parentCode: "1123" },
      { code: "112304", name: "압구정동", parentCode: "1123" },
      { code: "112305", name: "청담동", parentCode: "1123" },
      { code: "112306", name: "삼성1동", parentCode: "1123" },
      { code: "112307", name: "삼성2동", parentCode: "1123" },
      { code: "112308", name: "대치1동", parentCode: "1123" },
      { code: "112309", name: "대치2동", parentCode: "1123" },
      { code: "112310", name: "대치4동", parentCode: "1123" },
      { code: "112311", name: "역삼1동", parentCode: "1123" },
      { code: "112312", name: "역삼2동", parentCode: "1123" },
      { code: "112313", name: "도곡1동", parentCode: "1123" },
      { code: "112314", name: "도곡2동", parentCode: "1123" },
      { code: "112315", name: "개포1동", parentCode: "1123" },
      { code: "112316", name: "개포2동", parentCode: "1123" },
      { code: "112317", name: "개포4동", parentCode: "1123" },
      { code: "112318", name: "세곡동", parentCode: "1123" },
      { code: "112319", name: "일원본동", parentCode: "1123" },
      { code: "112320", name: "일원1동", parentCode: "1123" },
      { code: "112321", name: "수서동", parentCode: "1123" },
    ]
  }
  
  if (parentCode === "1124") {
    return [
      { code: "112401", name: "풍납1동", parentCode: "1124" },
      { code: "112402", name: "풍납2동", parentCode: "1124" },
      { code: "112403", name: "거여1동", parentCode: "1124" },
      { code: "112404", name: "거여2동", parentCode: "1124" },
      { code: "112405", name: "마천1동", parentCode: "1124" },
      { code: "112406", name: "마천2동", parentCode: "1124" },
      { code: "112407", name: "방이1동", parentCode: "1124" },
      { code: "112408", name: "방이2동", parentCode: "1124" },
      { code: "112409", name: "오금동", parentCode: "1124" },
      { code: "112410", name: "송파1동", parentCode: "1124" },
      { code: "112411", name: "송파2동", parentCode: "1124" },
      { code: "112412", name: "석촌동", parentCode: "1124" },
      { code: "112413", name: "삼전동", parentCode: "1124" },
      { code: "112414", name: "가락본동", parentCode: "1124" },
      { code: "112415", name: "가락1동", parentCode: "1124" },
      { code: "112416", name: "가락2동", parentCode: "1124" },
      { code: "112417", name: "문정1동", parentCode: "1124" },
      { code: "112418", name: "문정2동", parentCode: "1124" },
      { code: "112419", name: "장지동", parentCode: "1124" },
      { code: "112420", name: "위례동", parentCode: "1124" },
    ]
  }
  
  if (parentCode === "1125") {
    return [
      { code: "112501", name: "강일동", parentCode: "1125" },
      { code: "112502", name: "상일동", parentCode: "1125" },
      { code: "112503", name: "명일1동", parentCode: "1125" },
      { code: "112504", name: "명일2동", parentCode: "1125" },
      { code: "112505", name: "고덕1동", parentCode: "1125" },
      { code: "112506", name: "고덕2동", parentCode: "1125" },
      { code: "112507", name: "암사1동", parentCode: "1125" },
      { code: "112508", name: "암사2동", parentCode: "1125" },
      { code: "112509", name: "암사3동", parentCode: "1125" },
      { code: "112510", name: "천호1동", parentCode: "1125" },
      { code: "112511", name: "천호2동", parentCode: "1125" },
      { code: "112512", name: "천호3동", parentCode: "1125" },
      { code: "112513", name: "성내1동", parentCode: "1125" },
      { code: "112514", name: "성내2동", parentCode: "1125" },
      { code: "112515", name: "성내3동", parentCode: "1125" },
      { code: "112516", name: "길동", parentCode: "1125" },
      { code: "112517", name: "둔촌1동", parentCode: "1125" },
      { code: "112518", name: "둔촌2동", parentCode: "1125" },
    ]
  }
  
  // 부산광역시 동/읍/면
  if (parentCode === "2601") {
    return [
      { code: "260101", name: "중앙동", parentCode: "2601" },
      { code: "260102", name: "동광동", parentCode: "2601" },
      { code: "260103", name: "대청동", parentCode: "2601" },
      { code: "260104", name: "보수동", parentCode: "2601" },
      { code: "260105", name: "부평동", parentCode: "2601" },
      { code: "260106", name: "영주1동", parentCode: "2601" },
      { code: "260107", name: "영주2동", parentCode: "2601" },
    ]
  }
  
  if (parentCode === "2609") {
    return [
      { code: "260901", name: "우1동", parentCode: "2609" },
      { code: "260902", name: "우2동", parentCode: "2609" },
      { code: "260903", name: "우3동", parentCode: "2609" },
      { code: "260904", name: "중1동", parentCode: "2609" },
      { code: "260905", name: "중2동", parentCode: "2609" },
      { code: "260906", name: "좌1동", parentCode: "2609" },
      { code: "260907", name: "좌2동", parentCode: "2609" },
      { code: "260908", name: "좌3동", parentCode: "2609" },
      { code: "260909", name: "좌4동", parentCode: "2609" },
      { code: "260910", name: "송정동", parentCode: "2609" },
      { code: "260911", name: "반여1동", parentCode: "2609" },
      { code: "260912", name: "반여2동", parentCode: "2609" },
      { code: "260913", name: "반여3동", parentCode: "2609" },
      { code: "260914", name: "반여4동", parentCode: "2609" },
      { code: "260915", name: "반송1동", parentCode: "2609" },
      { code: "260916", name: "반송2동", parentCode: "2609" },
      { code: "260917", name: "재송1동", parentCode: "2609" },
      { code: "260918", name: "재송2동", parentCode: "2609" },
    ]
  }
  
  // 대구광역시 동/읍/면
  if (parentCode === "2701") {
    return [
      { code: "270101", name: "동인동", parentCode: "2701" },
      { code: "270102", name: "삼덕동", parentCode: "2701" },
      { code: "270103", name: "성내1동", parentCode: "2701" },
      { code: "270104", name: "성내2동", parentCode: "2701" },
      { code: "270105", name: "성내3동", parentCode: "2701" },
      { code: "270106", name: "대신동", parentCode: "2701" },
      { code: "270107", name: "남산1동", parentCode: "2701" },
      { code: "270108", name: "남산2동", parentCode: "2701" },
      { code: "270109", name: "남산3동", parentCode: "2701" },
      { code: "270110", name: "남산4동", parentCode: "2701" },
      { code: "270111", name: "대봉동", parentCode: "2701" },
    ]
  }
  
  if (parentCode === "2706") {
    return [
      { code: "270601", name: "범어1동", parentCode: "2706" },
      { code: "270602", name: "범어2동", parentCode: "2706" },
      { code: "270603", name: "범어3동", parentCode: "2706" },
      { code: "270604", name: "범어4동", parentCode: "2706" },
      { code: "270605", name: "만촌1동", parentCode: "2706" },
      { code: "270606", name: "만촌2동", parentCode: "2706" },
      { code: "270607", name: "만촌3동", parentCode: "2706" },
      { code: "270608", name: "수성1가동", parentCode: "2706" },
      { code: "270609", name: "수성2.3가동", parentCode: "2706" },
      { code: "270610", name: "수성4동", parentCode: "2706" },
      { code: "270611", name: "황금1동", parentCode: "2706" },
      { code: "270612", name: "황금2동", parentCode: "2706" },
      { code: "270613", name: "중동", parentCode: "2706" },
      { code: "270614", name: "상동", parentCode: "2706" },
      { code: "270615", name: "파동", parentCode: "2706" },
      { code: "270616", name: "두산동", parentCode: "2706" },
      { code: "270617", name: "지산1동", parentCode: "2706" },
      { code: "270618", name: "지산2동", parentCode: "2706" },
      { code: "270619", name: "고산1동", parentCode: "2706" },
      { code: "270620", name: "고산2동", parentCode: "2706" },
      { code: "270621", name: "고산3동", parentCode: "2706" },
    ]
  }
  
  // 인천광역시 동/읍/면
  if (parentCode === "2801") {
    return [
      { code: "280101", name: "중앙동", parentCode: "2801" },
      { code: "280102", name: "항동", parentCode: "2801" },
      { code: "280103", name: "경동", parentCode: "2801" },
      { code: "280104", name: "송학동", parentCode: "2801" },
      { code: "280105", name: "신흥동", parentCode: "2801" },
      { code: "280106", name: "신포동", parentCode: "2801" },
      { code: "280107", name: "도원동", parentCode: "2801" },
      { code: "280108", name: "율목동", parentCode: "2801" },
      { code: "280109", name: "동인천동", parentCode: "2801" },
      { code: "280110", name: "선린동", parentCode: "2801" },
      { code: "280111", name: "송월동", parentCode: "2801" },
      { code: "280112", name: "영종동", parentCode: "2801" },
      { code: "280113", name: "운서동", parentCode: "2801" },
      { code: "280114", name: "용유동", parentCode: "2801" },
    ]
  }
  
  if (parentCode === "2802") {
    return [
      { code: "280201", name: "만석동", parentCode: "2802" },
      { code: "280202", name: "화수동", parentCode: "2802" },
      { code: "280203", name: "송현동", parentCode: "2802" },
      { code: "280204", name: "화평동", parentCode: "2802" },
      { code: "280205", name: "창영동", parentCode: "2802" },
      { code: "280206", name: "금창동", parentCode: "2802" },
    ]
  }
  
  if (parentCode === "2803") {
    return [
      { code: "280301", name: "숭의1동", parentCode: "2803" },
      { code: "280302", name: "숭의2동", parentCode: "2803" },
      { code: "280303", name: "숭의3동", parentCode: "2803" },
      { code: "280304", name: "숭의4동", parentCode: "2803" },
      { code: "280305", name: "용현1동", parentCode: "2803" },
      { code: "280306", name: "용현2동", parentCode: "2803" },
      { code: "280307", name: "용현3동", parentCode: "2803" },
      { code: "280308", name: "용현4동", parentCode: "2803" },
      { code: "280309", name: "용현5동", parentCode: "2803" },
      { code: "280310", name: "학익1동", parentCode: "2803" },
      { code: "280311", name: "학익2동", parentCode: "2803" },
      { code: "280312", name: "도화1동", parentCode: "2803" },
      { code: "280313", name: "도화2동", parentCode: "2803" },
      { code: "280314", name: "주안1동", parentCode: "2803" },
      { code: "280315", name: "주안2동", parentCode: "2803" },
      { code: "280316", name: "주안3동", parentCode: "2803" },
      { code: "280317", name: "주안4동", parentCode: "2803" },
      { code: "280318", name: "주안5동", parentCode: "2803" },
      { code: "280319", name: "주안6동", parentCode: "2803" },
      { code: "280320", name: "주안7동", parentCode: "2803" },
      { code: "280321", name: "주안8동", parentCode: "2803" },
      { code: "280322", name: "관교동", parentCode: "2803" },
      { code: "280323", name: "문학동", parentCode: "2803" },
    ]
  }
  
  if (parentCode === "2804") {
    return [
      { code: "280401", name: "연수1동", parentCode: "2804" },
      { code: "280402", name: "연수2동", parentCode: "2804" },
      { code: "280403", name: "연수3동", parentCode: "2804" },
      { code: "280404", name: "청학동", parentCode: "2804" },
      { code: "280405", name: "동춘1동", parentCode: "2804" },
      { code: "280406", name: "동춘2동", parentCode: "2804" },
      { code: "280407", name: "동춘3동", parentCode: "2804" },
      { code: "280408", name: "송도1동", parentCode: "2804" },
      { code: "280409", name: "송도2동", parentCode: "2804" },
      { code: "280410", name: "송도3동", parentCode: "2804" },
      { code: "280411", name: "송도4동", parentCode: "2804" },
      { code: "280412", name: "송도5동", parentCode: "2804" },
    ]
  }
  
  if (parentCode === "2805") {
    return [
      { code: "280501", name: "구월1동", parentCode: "2805" },
      { code: "280502", name: "구월2동", parentCode: "2805" },
      { code: "280503", name: "구월3동", parentCode: "2805" },
      { code: "280504", name: "구월4동", parentCode: "2805" },
      { code: "280505", name: "간석1동", parentCode: "2805" },
      { code: "280506", name: "간석2동", parentCode: "2805" },
      { code: "280507", name: "간석3동", parentCode: "2805" },
      { code: "280508", name: "간석4동", parentCode: "2805" },
      { code: "280509", name: "만수1동", parentCode: "2805" },
      { code: "280510", name: "만수2동", parentCode: "2805" },
      { code: "280511", name: "만수3동", parentCode: "2805" },
      { code: "280512", name: "만수4동", parentCode: "2805" },
      { code: "280513", name: "만수5동", parentCode: "2805" },
      { code: "280514", name: "만수6동", parentCode: "2805" },
      { code: "280515", name: "장수동", parentCode: "2805" },
      { code: "280516", name: "서창동", parentCode: "2805" },
      { code: "280517", name: "논현1동", parentCode: "2805" },
      { code: "280518", name: "논현2동", parentCode: "2805" },
      { code: "280519", name: "논현고잔동", parentCode: "2805" },
    ]
  }
  
  if (parentCode === "2806") {
    return [
      { code: "280601", name: "부평1동", parentCode: "2806" },
      { code: "280602", name: "부평2동", parentCode: "2806" },
      { code: "280603", name: "부평3동", parentCode: "2806" },
      { code: "280604", name: "부평4동", parentCode: "2806" },
      { code: "280605", name: "부평5동", parentCode: "2806" },
      { code: "280606", name: "부평6동", parentCode: "2806" },
      { code: "280607", name: "산곡1동", parentCode: "2806" },
      { code: "280608", name: "산곡2동", parentCode: "2806" },
      { code: "280609", name: "산곡3동", parentCode: "2806" },
      { code: "280610", name: "산곡4동", parentCode: "2806" },
      { code: "280611", name: "청천1동", parentCode: "2806" },
      { code: "280612", name: "청천2동", parentCode: "2806" },
      { code: "280613", name: "갈산1동", parentCode: "2806" },
      { code: "280614", name: "갈산2동", parentCode: "2806" },
      { code: "280615", name: "삼산1동", parentCode: "2806" },
      { code: "280616", name: "삼산2동", parentCode: "2806" },
      { code: "280617", name: "십정1동", parentCode: "2806" },
      { code: "280618", name: "십정2동", parentCode: "2806" },
    ]
  }
  
  if (parentCode === "2807") {
    return [
      { code: "280701", name: "작전1동", parentCode: "2807" },
      { code: "280702", name: "작전2동", parentCode: "2807" },
      { code: "280703", name: "작전서운동", parentCode: "2807" },
      { code: "280704", name: "계양1동", parentCode: "2807" },
      { code: "280705", name: "계양2동", parentCode: "2807" },
      { code: "280706", name: "계양3동", parentCode: "2807" },
      { code: "280707", name: "박촌동", parentCode: "2807" },
      { code: "280708", name: "계산1동", parentCode: "2807" },
      { code: "280709", name: "계산2동", parentCode: "2807" },
      { code: "280710", name: "계산3동", parentCode: "2807" },
      { code: "280711", name: "계산4동", parentCode: "2807" },
      { code: "280712", name: "계산5동", parentCode: "2807" },
      { code: "280713", name: "서운동", parentCode: "2807" },
      { code: "280714", name: "임학동", parentCode: "2807" },
      { code: "280715", name: "용종동", parentCode: "2807" },
      { code: "280716", name: "병방동", parentCode: "2807" },
    ]
  }
  
  if (parentCode === "2808") {
    return [
      { code: "280801", name: "가정1동", parentCode: "2808" },
      { code: "280802", name: "가정2동", parentCode: "2808" },
      { code: "280803", name: "가정3동", parentCode: "2808" },
      { code: "280804", name: "석남1동", parentCode: "2808" },
      { code: "280805", name: "석남2동", parentCode: "2808" },
      { code: "280806", name: "석남3동", parentCode: "2808" },
      { code: "280807", name: "신현원창동", parentCode: "2808" },
      { code: "280808", name: "가좌1동", parentCode: "2808" },
      { code: "280809", name: "가좌2동", parentCode: "2808" },
      { code: "280810", name: "가좌3동", parentCode: "2808" },
      { code: "280811", name: "가좌4동", parentCode: "2808" },
      { code: "280812", name: "검암경서동", parentCode: "2808" },
      { code: "280813", name: "연희동", parentCode: "2808" },
      { code: "280814", name: "청라1동", parentCode: "2808" },
      { code: "280815", name: "청라2동", parentCode: "2808" },
      { code: "280816", name: "청라3동", parentCode: "2808" },
      { code: "280817", name: "가경동", parentCode: "2808" },
      { code: "280818", name: "백석동", parentCode: "2808" },
      { code: "280819", name: "시천동", parentCode: "2808" },
      { code: "280820", name: "검단동", parentCode: "2808" },
      { code: "280821", name: "불로대곡동", parentCode: "2808" },
      { code: "280822", name: "원당동", parentCode: "2808" },
      { code: "280823", name: "당하동", parentCode: "2808" },
      { code: "280824", name: "오류왕길동", parentCode: "2808" },
      { code: "280825", name: "마전동", parentCode: "2808" },
      { code: "280826", name: "아라동", parentCode: "2808" },
    ]
  }
  
  if (parentCode === "2809") {
    return [
      { code: "280901", name: "강화읍", parentCode: "2809" },
      { code: "280902", name: "선원면", parentCode: "2809" },
      { code: "280903", name: "불은면", parentCode: "2809" },
      { code: "280904", name: "길상면", parentCode: "2809" },
      { code: "280905", name: "화도면", parentCode: "2809" },
      { code: "280906", name: "양도면", parentCode: "2809" },
      { code: "280907", name: "내가면", parentCode: "2809" },
      { code: "280908", name: "하점면", parentCode: "2809" },
      { code: "280909", name: "양사면", parentCode: "2809" },
      { code: "280910", name: "송해면", parentCode: "2809" },
      { code: "280911", name: "교동면", parentCode: "2809" },
      { code: "280912", name: "삼산면", parentCode: "2809" },
    ]
  }
  
  if (parentCode === "2810") {
    return [
      { code: "281001", name: "북도면", parentCode: "2810" },
      { code: "281002", name: "연평면", parentCode: "2810" },
      { code: "281003", name: "백령면", parentCode: "2810" },
      { code: "281004", name: "대청면", parentCode: "2810" },
      { code: "281005", name: "덕적면", parentCode: "2810" },
      { code: "281006", name: "자월면", parentCode: "2810" },
    ]
  }
  
  // 경기도 시/군 동/읍/면
  if (parentCode === "4101") {
    return [
      { code: "410101", name: "영통동", parentCode: "4101" },
      { code: "410102", name: "팔달동", parentCode: "4101" },
      { code: "410103", name: "매탄동", parentCode: "4101" },
      { code: "410104", name: "원천동", parentCode: "4101" },
      { code: "410105", name: "이의동", parentCode: "4101" },
      { code: "410106", name: "하동", parentCode: "4101" },
      { code: "410107", name: "영화동", parentCode: "4101" },
      { code: "410108", name: "송죽동", parentCode: "4101" },
      { code: "410109", name: "조원동", parentCode: "4101" },
      { code: "410110", name: "연무동", parentCode: "4101" },
      { code: "410111", name: "우만동", parentCode: "4101" },
      { code: "410112", name: "인계동", parentCode: "4101" },
      { code: "410113", name: "세류동", parentCode: "4101" },
      { code: "410114", name: "평동", parentCode: "4101" },
      { code: "410115", name: "고등동", parentCode: "4101" },
      { code: "410116", name: "일월동", parentCode: "4101" },
      { code: "410117", name: "탑동", parentCode: "4101" },
      { code: "410118", name: "구운동", parentCode: "4101" },
      { code: "410119", name: "금곡동", parentCode: "4101" },
      { code: "410120", name: "호매실동", parentCode: "4101" },
      { code: "410121", name: "권선동", parentCode: "4101" },
      { code: "410122", name: "곡반정동", parentCode: "4101" },
      { code: "410123", name: "서둔동", parentCode: "4101" },
      { code: "410124", name: "지동", parentCode: "4101" },
      { code: "410125", name: "영덕동", parentCode: "4101" },
      { code: "410126", name: "신동", parentCode: "4101" },
      { code: "410127", name: "목동", parentCode: "4101" },
      { code: "410128", name: "오목천동", parentCode: "4101" },
      { code: "410129", name: "천천동", parentCode: "4101" },
      { code: "410130", name: "상광교동", parentCode: "4101" },
      { code: "410131", name: "하광교동", parentCode: "4101" },
    ]
  }
  
  if (parentCode === "4102") {
    return [
      { code: "410201", name: "수정동", parentCode: "4102" },
      { code: "410202", name: "태평동", parentCode: "4102" },
      { code: "410203", name: "신흥동", parentCode: "4102" },
      { code: "410204", name: "금광동", parentCode: "4102" },
      { code: "410205", name: "은행동", parentCode: "4102" },
      { code: "410206", name: "성남동", parentCode: "4102" },
      { code: "410207", name: "중앙동", parentCode: "4102" },
      { code: "410208", name: "여수동", parentCode: "4102" },
      { code: "410209", name: "도촌동", parentCode: "4102" },
      { code: "410210", name: "갈현동", parentCode: "4102" },
      { code: "410211", name: "양지동", parentCode: "4102" },
      { code: "410212", name: "중원동", parentCode: "4102" },
      { code: "410213", name: "하대원동", parentCode: "4102" },
      { code: "410214", name: "상대원동", parentCode: "4102" },
      { code: "410215", name: "야탑동", parentCode: "4102" },
      { code: "410216", name: "이매동", parentCode: "4102" },
      { code: "410217", name: "서현동", parentCode: "4102" },
      { code: "410218", name: "판교동", parentCode: "4102" },
      { code: "410219", name: "삼평동", parentCode: "4102" },
      { code: "410220", name: "백현동", parentCode: "4102" },
      { code: "410221", name: "미금동", parentCode: "4102" },
      { code: "410222", name: "정자동", parentCode: "4102" },
      { code: "410223", name: "불정동", parentCode: "4102" },
      { code: "410224", name: "신기동", parentCode: "4102" },
      { code: "410225", name: "운중동", parentCode: "4102" },
    ]
  }
  
  if (parentCode === "4103") {
    return [
      { code: "410301", name: "의정부1동", parentCode: "4103" },
      { code: "410302", name: "의정부2동", parentCode: "4103" },
      { code: "410303", name: "의정부3동", parentCode: "4103" },
      { code: "410304", name: "호원1동", parentCode: "4103" },
      { code: "410305", name: "호원2동", parentCode: "4103" },
      { code: "410306", name: "장암동", parentCode: "4103" },
      { code: "410307", name: "신곡1동", parentCode: "4103" },
      { code: "410308", name: "신곡2동", parentCode: "4103" },
      { code: "410309", name: "송산1동", parentCode: "4103" },
      { code: "410310", name: "송산2동", parentCode: "4103" },
      { code: "410311", name: "송산3동", parentCode: "4103" },
      { code: "410312", name: "자금동", parentCode: "4103" },
      { code: "410313", name: "가능동", parentCode: "4103" },
      { code: "410314", name: "녹양동", parentCode: "4103" },
      { code: "410315", name: "금오동", parentCode: "4103" },
    ]
  }
  
  if (parentCode === "4104") {
    return [
      { code: "410401", name: "만안동", parentCode: "4104" },
      { code: "410402", name: "안양1동", parentCode: "4104" },
      { code: "410403", name: "안양2동", parentCode: "4104" },
      { code: "410404", name: "안양3동", parentCode: "4104" },
      { code: "410405", name: "안양4동", parentCode: "4104" },
      { code: "410406", name: "안양5동", parentCode: "4104" },
      { code: "410407", name: "안양6동", parentCode: "4104" },
      { code: "410408", name: "안양7동", parentCode: "4104" },
      { code: "410409", name: "안양8동", parentCode: "4104" },
      { code: "410410", name: "안양9동", parentCode: "4104" },
      { code: "410411", name: "석수1동", parentCode: "4104" },
      { code: "410412", name: "석수2동", parentCode: "4104" },
      { code: "410413", name: "석수3동", parentCode: "4104" },
      { code: "410414", name: "박달1동", parentCode: "4104" },
      { code: "410415", name: "박달2동", parentCode: "4104" },
    ]
  }
  
  if (parentCode === "4105") {
    return [
      { code: "410501", name: "원미1동", parentCode: "4105" },
      { code: "410502", name: "원미2동", parentCode: "4105" },
      { code: "410503", name: "소사동", parentCode: "4105" },
      { code: "410504", name: "역곡1동", parentCode: "4105" },
      { code: "410505", name: "역곡2동", parentCode: "4105" },
      { code: "410506", name: "춘의동", parentCode: "4105" },
      { code: "410507", name: "도당동", parentCode: "4105" },
      { code: "410508", name: "약대동", parentCode: "4105" },
      { code: "410509", name: "소사본동", parentCode: "4105" },
      { code: "410510", name: "소사본1동", parentCode: "4105" },
      { code: "410511", name: "소사본2동", parentCode: "4105" },
      { code: "410512", name: "소사본3동", parentCode: "4105" },
      { code: "410513", name: "소사본4동", parentCode: "4105" },
      { code: "410514", name: "소사본5동", parentCode: "4105" },
      { code: "410515", name: "소사본6동", parentCode: "4105" },
      { code: "410516", name: "소사본7동", parentCode: "4105" },
      { code: "410517", name: "소사본8동", parentCode: "4105" },
      { code: "410518", name: "소사본9동", parentCode: "4105" },
      { code: "410519", name: "소사본10동", parentCode: "4105" },
    ]
  }
  
  if (parentCode === "4106") {
    return [
      { code: "410601", name: "광명1동", parentCode: "4106" },
      { code: "410602", name: "광명2동", parentCode: "4106" },
      { code: "410603", name: "광명3동", parentCode: "4106" },
      { code: "410604", name: "광명4동", parentCode: "4106" },
      { code: "410605", name: "광명5동", parentCode: "4106" },
      { code: "410606", name: "광명6동", parentCode: "4106" },
      { code: "410607", name: "광명7동", parentCode: "4106" },
      { code: "410608", name: "철산1동", parentCode: "4106" },
      { code: "410609", name: "철산2동", parentCode: "4106" },
      { code: "410610", name: "철산3동", parentCode: "4106" },
      { code: "410611", name: "철산4동", parentCode: "4106" },
      { code: "410612", name: "하안1동", parentCode: "4106" },
      { code: "410613", name: "하안2동", parentCode: "4106" },
      { code: "410614", name: "하안3동", parentCode: "4106" },
      { code: "410615", name: "하안4동", parentCode: "4106" },
      { code: "410616", name: "소하1동", parentCode: "4106" },
      { code: "410617", name: "소하2동", parentCode: "4106" },
      { code: "410618", name: "학온동", parentCode: "4106" },
    ]
  }
  
  if (parentCode === "4107") {
    return [
      { code: "410701", name: "평택동", parentCode: "4107" },
      { code: "410702", name: "서정동", parentCode: "4107" },
      { code: "410703", name: "청북동", parentCode: "4107" },
      { code: "410704", name: "송탄동", parentCode: "4107" },
      { code: "410705", name: "고덕동", parentCode: "4107" },
      { code: "410706", name: "오성동", parentCode: "4107" },
      { code: "410707", name: "현덕동", parentCode: "4107" },
      { code: "410708", name: "중앙동", parentCode: "4107" },
      { code: "410709", name: "신평동", parentCode: "4107" },
      { code: "410710", name: "비전1동", parentCode: "4107" },
      { code: "410711", name: "비전2동", parentCode: "4107" },
      { code: "410712", name: "세교동", parentCode: "4107" },
      { code: "410713", name: "팽성읍", parentCode: "4107" },
      { code: "410714", name: "안중읍", parentCode: "4107" },
      { code: "410715", name: "진위면", parentCode: "4107" },
      { code: "410716", name: "서탄면", parentCode: "4107" },
      { code: "410717", name: "고덕면", parentCode: "4107" },
      { code: "410718", name: "오성면", parentCode: "4107" },
      { code: "410719", name: "현덕면", parentCode: "4107" },
    ]
  }
  
  if (parentCode === "4108") {
    return [
      { code: "410801", name: "과천동", parentCode: "4108" },
      { code: "410802", name: "중앙동", parentCode: "4108" },
      { code: "410803", name: "갈현동", parentCode: "4108" },
      { code: "410804", name: "별양동", parentCode: "4108" },
      { code: "410805", name: "부림동", parentCode: "4108" },
      { code: "410806", name: "과천동", parentCode: "4108" },
      { code: "410807", name: "문원동", parentCode: "4108" },
    ]
  }
  
  if (parentCode === "4109") {
    return [
      { code: "410901", name: "오산동", parentCode: "4109" },
      { code: "410902", name: "원동", parentCode: "4109" },
      { code: "410903", name: "세마동", parentCode: "4109" },
      { code: "410904", name: "궐동", parentCode: "4109" },
      { code: "410905", name: "청학동", parentCode: "4109" },
      { code: "410906", name: "대원동", parentCode: "4109" },
      { code: "410907", name: "수청동", parentCode: "4109" },
      { code: "410908", name: "고현동", parentCode: "4109" },
      { code: "410909", name: "발안동", parentCode: "4109" },
      { code: "410910", name: "양산동", parentCode: "4109" },
      { code: "410911", name: "월암동", parentCode: "4109" },
      { code: "410912", name: "지곶동", parentCode: "4109" },
      { code: "410913", name: "서동", parentCode: "4109" },
      { code: "410914", name: "서동", parentCode: "4109" },
      { code: "410915", name: "벌음동", parentCode: "4109" },
      { code: "410916", name: "두곡동", parentCode: "4109" },
      { code: "410917", name: "탑동", parentCode: "4109" },
      { code: "410918", name: "가수동", parentCode: "4109" },
      { code: "410919", name: "가수동", parentCode: "4109" },
      { code: "410920", name: "가수동", parentCode: "4109" },
    ]
  }
  
  if (parentCode === "4110") {
    return [
      { code: "411001", name: "시흥동", parentCode: "4110" },
      { code: "411002", name: "신천동", parentCode: "4110" },
      { code: "411003", name: "매화동", parentCode: "4110" },
      { code: "411004", name: "목감동", parentCode: "4110" },
      { code: "411005", name: "신현동", parentCode: "4110" },
      { code: "411006", name: "연성동", parentCode: "4110" },
      { code: "411007", name: "장곡동", parentCode: "4110" },
      { code: "411008", name: "월곶동", parentCode: "4110" },
      { code: "411009", name: "정왕1동", parentCode: "4110" },
      { code: "411010", name: "정왕2동", parentCode: "4110" },
      { code: "411011", name: "정왕3동", parentCode: "4110" },
      { code: "411012", name: "정왕4동", parentCode: "4110" },
      { code: "411013", name: "배곧동", parentCode: "4110" },
      { code: "411014", name: "과림동", parentCode: "4110" },
      { code: "411015", name: "계수동", parentCode: "4110" },
      { code: "411016", name: "광석동", parentCode: "4110" },
      { code: "411017", name: "하중동", parentCode: "4110" },
      { code: "411018", name: "하상동", parentCode: "4110" },
      { code: "411019", name: "광석동", parentCode: "4110" },
      { code: "411020", name: "광석동", parentCode: "4110" },
    ]
  }
  
  if (parentCode === "4102") {
    return [
      { code: "410201", name: "수정동", parentCode: "4102" },
      { code: "410202", name: "태평동", parentCode: "4102" },
      { code: "410203", name: "신흥동", parentCode: "4102" },
      { code: "410204", name: "금광동", parentCode: "4102" },
      { code: "410205", name: "은행동", parentCode: "4102" },
      { code: "410206", name: "성남동", parentCode: "4102" },
      { code: "410207", name: "중앙동", parentCode: "4102" },
      { code: "410208", name: "여수동", parentCode: "4102" },
      { code: "410209", name: "도촌동", parentCode: "4102" },
      { code: "410210", name: "갈현동", parentCode: "4102" },
      { code: "410211", name: "양지동", parentCode: "4102" },
      { code: "410212", name: "중원동", parentCode: "4102" },
      { code: "410213", name: "하대원동", parentCode: "4102" },
      { code: "410214", name: "상대원동", parentCode: "4102" },
      { code: "410215", name: "야탑동", parentCode: "4102" },
      { code: "410216", name: "이매동", parentCode: "4102" },
      { code: "410217", name: "서현동", parentCode: "4102" },
      { code: "410218", name: "판교동", parentCode: "4102" },
      { code: "410219", name: "삼평동", parentCode: "4102" },
      { code: "410220", name: "백현동", parentCode: "4102" },
      { code: "410221", name: "미금동", parentCode: "4102" },
      { code: "410222", name: "정자동", parentCode: "4102" },
      { code: "410223", name: "불정동", parentCode: "4102" },
      { code: "410224", name: "신기동", parentCode: "4102" },
      { code: "410225", name: "운중동", parentCode: "4102" },
    ]
  }
  
  // 강원특별자치도 동/읍/면
  if (parentCode === "4201") {
    return [
      { code: "420101", name: "신북읍", parentCode: "4201" },
      { code: "420102", name: "동면", parentCode: "4201" },
      { code: "420103", name: "동산면", parentCode: "4201" },
      { code: "420104", name: "신동면", parentCode: "4201" },
      { code: "420105", name: "남면", parentCode: "4201" },
      { code: "420106", name: "서면", parentCode: "4201" },
      { code: "420107", name: "사북면", parentCode: "4201" },
      { code: "420108", name: "북산면", parentCode: "4201" },
      { code: "420109", name: "동내면", parentCode: "4201" },
      { code: "420110", name: "남산면", parentCode: "4201" },
      { code: "420111", name: "교동", parentCode: "4201" },
      { code: "420112", name: "조운동", parentCode: "4201" },
      { code: "420113", name: "약사명동", parentCode: "4201" },
      { code: "420114", name: "소양동", parentCode: "4201" },
      { code: "420115", name: "신사우동", parentCode: "4201" },
      { code: "420116", name: "근화동", parentCode: "4201" },
      { code: "420117", name: "우두동", parentCode: "4201" },
      { code: "420118", name: "사농동", parentCode: "4201" },
      { code: "420119", name: "후평1동", parentCode: "4201" },
      { code: "420120", name: "후평2동", parentCode: "4201" },
      { code: "420121", name: "후평3동", parentCode: "4201" },
      { code: "420122", name: "효자1동", parentCode: "4201" },
      { code: "420123", name: "효자2동", parentCode: "4201" },
      { code: "420124", name: "효자3동", parentCode: "4201" },
      { code: "420125", name: "석사동", parentCode: "4201" },
      { code: "420126", name: "퇴계동", parentCode: "4201" },
      { code: "420127", name: "강남동", parentCode: "4201" },
    ]
  }
  
  if (parentCode === "4202") {
    return [
      { code: "420201", name: "문막읍", parentCode: "4202" },
      { code: "420202", name: "소초면", parentCode: "4202" },
      { code: "420203", name: "호저면", parentCode: "4202" },
      { code: "420204", name: "지정면", parentCode: "4202" },
      { code: "420205", name: "부론면", parentCode: "4202" },
      { code: "420206", name: "귀래면", parentCode: "4202" },
      { code: "420207", name: "흥업면", parentCode: "4202" },
      { code: "420208", name: "판부면", parentCode: "4202" },
      { code: "420209", name: "신림면", parentCode: "4202" },
      { code: "420210", name: "중앙동", parentCode: "4202" },
      { code: "420211", name: "원인동", parentCode: "4202" },
      { code: "420212", name: "개운동", parentCode: "4202" },
      { code: "420213", name: "명륜동", parentCode: "4202" },
      { code: "420214", name: "단구동", parentCode: "4202" },
      { code: "420215", name: "일산동", parentCode: "4202" },
      { code: "420216", name: "학성동", parentCode: "4202" },
      { code: "420217", name: "단계동", parentCode: "4202" },
      { code: "420218", name: "우산동", parentCode: "4202" },
      { code: "420219", name: "태장1동", parentCode: "4202" },
      { code: "420220", name: "태장2동", parentCode: "4202" },
      { code: "420221", name: "봉산동", parentCode: "4202" },
      { code: "420222", name: "행구동", parentCode: "4202" },
      { code: "420223", name: "무실동", parentCode: "4202" },
      { code: "420224", name: "반곡관설동", parentCode: "4202" },
    ]
  }
  
  if (parentCode === "4203") {
    return [
      { code: "420301", name: "주문진읍", parentCode: "4203" },
      { code: "420302", name: "성산면", parentCode: "4203" },
      { code: "420303", name: "왕산면", parentCode: "4203" },
      { code: "420304", name: "구정면", parentCode: "4203" },
      { code: "420305", name: "강동면", parentCode: "4203" },
      { code: "420306", name: "옥계면", parentCode: "4203" },
      { code: "420307", name: "사천면", parentCode: "4203" },
      { code: "420308", name: "연곡면", parentCode: "4203" },
      { code: "420309", name: "홍제동", parentCode: "4203" },
      { code: "420310", name: "중앙동", parentCode: "4203" },
      { code: "420311", name: "옥천동", parentCode: "4203" },
      { code: "420312", name: "교1동", parentCode: "4203" },
      { code: "420313", name: "교2동", parentCode: "4203" },
      { code: "420314", name: "포남1동", parentCode: "4203" },
      { code: "420315", name: "포남2동", parentCode: "4203" },
      { code: "420316", name: "초당동", parentCode: "4203" },
      { code: "420317", name: "강문동", parentCode: "4203" },
      { code: "420318", name: "송정동", parentCode: "4203" },
      { code: "420319", name: "내곡동", parentCode: "4203" },
      { code: "420320", name: "강남동", parentCode: "4203" },
      { code: "420321", name: "성내동", parentCode: "4203" },
      { code: "420322", name: "경포동", parentCode: "4203" },
      { code: "420323", name: "오대동", parentCode: "4203" },
    ]
  }
  
  if (parentCode === "4204") {
    return [
      { code: "420401", name: "천곡동", parentCode: "4204" },
      { code: "420402", name: "송정동", parentCode: "4204" },
      { code: "420403", name: "북삼동", parentCode: "4204" },
      { code: "420404", name: "부곡동", parentCode: "4204" },
      { code: "420405", name: "동호동", parentCode: "4204" },
      { code: "420406", name: "발한동", parentCode: "4204" },
      { code: "420407", name: "묵호동", parentCode: "4204" },
      { code: "420408", name: "북평동", parentCode: "4204" },
      { code: "420409", name: "망상동", parentCode: "4204" },
      { code: "420410", name: "어달동", parentCode: "4204" },
      { code: "420411", name: "신흥동", parentCode: "4204" },
      { code: "420412", name: "삼화동", parentCode: "4204" },
      { code: "420413", name: "이도동", parentCode: "4204" },
      { code: "420414", name: "이호동", parentCode: "4204" },
      { code: "420415", name: "단봉동", parentCode: "4204" },
      { code: "420416", name: "지가동", parentCode: "4204" },
      { code: "420417", name: "용정동", parentCode: "4204" },
      { code: "420418", name: "초구동", parentCode: "4204" },
      { code: "420419", name: "괴란동", parentCode: "4204" },
      { code: "420420", name: "만우동", parentCode: "4204" },
      { code: "420421", name: "사곡동", parentCode: "4204" },
      { code: "420422", name: "어달동", parentCode: "4204" },
    ]
  }
  
  if (parentCode === "4205") {
    return [
      { code: "420501", name: "황지동", parentCode: "4205" },
      { code: "420502", name: "황연동", parentCode: "4205" },
      { code: "420503", name: "삼수동", parentCode: "4205" },
      { code: "420504", name: "상장동", parentCode: "4205" },
      { code: "420505", name: "문곡동", parentCode: "4205" },
      { code: "420506", name: "적성동", parentCode: "4205" },
      { code: "420507", name: "화전동", parentCode: "4205" },
      { code: "420508", name: "동점동", parentCode: "4205" },
      { code: "420509", name: "소도동", parentCode: "4205" },
      { code: "420510", name: "상사미동", parentCode: "4205" },
      { code: "420511", name: "하사미동", parentCode: "4205" },
      { code: "420512", name: "조탄동", parentCode: "4205" },
      { code: "420513", name: "노곡동", parentCode: "4205" },
      { code: "420514", name: "적각동", parentCode: "4205" },
      { code: "420515", name: "창죽동", parentCode: "4205" },
      { code: "420516", name: "통리동", parentCode: "4205" },
      { code: "420517", name: "백산동", parentCode: "4205" },
      { code: "420518", name: "상사미동", parentCode: "4205" },
      { code: "420519", name: "하사미동", parentCode: "4205" },
      { code: "420520", name: "조탄동", parentCode: "4205" },
    ]
  }
  
  if (parentCode === "4206") {
    return [
      { code: "420601", name: "영랑동", parentCode: "4206" },
      { code: "420602", name: "성내동", parentCode: "4206" },
      { code: "420603", name: "중앙동", parentCode: "4206" },
      { code: "420604", name: "교동", parentCode: "4206" },
      { code: "420605", name: "노학동", parentCode: "4206" },
      { code: "420606", name: "조양동", parentCode: "4206" },
      { code: "420607", name: "청학동", parentCode: "4206" },
      { code: "420608", name: "대포동", parentCode: "4206" },
      { code: "420609", name: "도문동", parentCode: "4206" },
      { code: "420610", name: "설악동", parentCode: "4206" },
      { code: "420611", name: "장사동", parentCode: "4206" },
      { code: "420612", name: "장사동", parentCode: "4206" },
      { code: "420613", name: "장사동", parentCode: "4206" },
      { code: "420614", name: "장사동", parentCode: "4206" },
      { code: "420615", name: "장사동", parentCode: "4206" },
      { code: "420616", name: "장사동", parentCode: "4206" },
      { code: "420617", name: "장사동", parentCode: "4206" },
      { code: "420618", name: "장사동", parentCode: "4206" },
      { code: "420619", name: "장사동", parentCode: "4206" },
      { code: "420620", name: "장사동", parentCode: "4206" },
    ]
  }
  
  if (parentCode === "4207") {
    return [
      { code: "420701", name: "도계읍", parentCode: "4207" },
      { code: "420702", name: "원덕읍", parentCode: "4207" },
      { code: "420703", name: "근덕면", parentCode: "4207" },
      { code: "420704", name: "하장면", parentCode: "4207" },
      { code: "420705", name: "노곡면", parentCode: "4207" },
      { code: "420706", name: "미로면", parentCode: "4207" },
      { code: "420707", name: "가곡면", parentCode: "4207" },
      { code: "420708", name: "신기면", parentCode: "4207" },
      { code: "420709", name: "남양동", parentCode: "4207" },
      { code: "420710", name: "교동", parentCode: "4207" },
      { code: "420711", name: "정라동", parentCode: "4207" },
      { code: "420712", name: "성내동", parentCode: "4207" },
      { code: "420713", name: "갈마동", parentCode: "4207" },
      { code: "420714", name: "내곡동", parentCode: "4207" },
      { code: "420715", name: "회야동", parentCode: "4207" },
      { code: "420716", name: "죽도동", parentCode: "4207" },
      { code: "420717", name: "오분동", parentCode: "4207" },
      { code: "420718", name: "적노동", parentCode: "4207" },
      { code: "420719", name: "조비동", parentCode: "4207" },
      { code: "420720", name: "대포동", parentCode: "4207" },
    ]
  }
  
  // 충청북도 동/읍/면
  if (parentCode === "4301") {
    return [
      { code: "430101", name: "상당구", parentCode: "4301" },
      { code: "430102", name: "서원구", parentCode: "4301" },
      { code: "430103", name: "흥덕구", parentCode: "4301" },
      { code: "430104", name: "청원구", parentCode: "4301" },
    ]
  }
  
  if (parentCode === "4302") {
    return [
      { code: "430201", name: "충주동", parentCode: "4302" },
      { code: "430202", name: "교현동", parentCode: "4302" },
      { code: "430203", name: "연수동", parentCode: "4302" },
      { code: "430204", name: "용산동", parentCode: "4302" },
      { code: "430205", name: "성내동", parentCode: "4302" },
      { code: "430206", name: "교현동", parentCode: "4302" },
      { code: "430207", name: "연수동", parentCode: "4302" },
      { code: "430208", name: "용산동", parentCode: "4302" },
      { code: "430209", name: "성내동", parentCode: "4302" },
      { code: "430210", name: "교현동", parentCode: "4302" },
      { code: "430211", name: "연수동", parentCode: "4302" },
      { code: "430212", name: "용산동", parentCode: "4302" },
      { code: "430213", name: "성내동", parentCode: "4302" },
      { code: "430214", name: "교현동", parentCode: "4302" },
      { code: "430215", name: "연수동", parentCode: "4302" },
      { code: "430216", name: "용산동", parentCode: "4302" },
      { code: "430217", name: "성내동", parentCode: "4302" },
      { code: "430218", name: "교현동", parentCode: "4302" },
      { code: "430219", name: "연수동", parentCode: "4302" },
      { code: "430220", name: "용산동", parentCode: "4302" },
    ]
  }
  
  if (parentCode === "4303") {
    return [
      { code: "430301", name: "제천동", parentCode: "4303" },
      { code: "430302", name: "의림동", parentCode: "4303" },
      { code: "430303", name: "신월동", parentCode: "4303" },
      { code: "430304", name: "청전동", parentCode: "4303" },
      { code: "430305", name: "화산동", parentCode: "4303" },
      { code: "430306", name: "영서동", parentCode: "4303" },
      { code: "430307", name: "용두동", parentCode: "4303" },
      { code: "430308", name: "신월동", parentCode: "4303" },
      { code: "430309", name: "청전동", parentCode: "4303" },
      { code: "430310", name: "화산동", parentCode: "4303" },
      { code: "430311", name: "영서동", parentCode: "4303" },
      { code: "430312", name: "용두동", parentCode: "4303" },
      { code: "430313", name: "신월동", parentCode: "4303" },
      { code: "430314", name: "청전동", parentCode: "4303" },
      { code: "430315", name: "화산동", parentCode: "4303" },
      { code: "430316", name: "영서동", parentCode: "4303" },
      { code: "430317", name: "용두동", parentCode: "4303" },
      { code: "430318", name: "신월동", parentCode: "4303" },
      { code: "430319", name: "청전동", parentCode: "4303" },
      { code: "430320", name: "화산동", parentCode: "4303" },
    ]
  }
  
  // 충청남도 동/읍/면
  if (parentCode === "4401") {
    return [
      { code: "440101", name: "동남구", parentCode: "4401" },
      { code: "440102", name: "서북구", parentCode: "4401" },
    ]
  }
  
  if (parentCode === "4402") {
    return [
      { code: "440201", name: "공주동", parentCode: "4402" },
      { code: "440202", name: "반죽동", parentCode: "4402" },
      { code: "440203", name: "웅진동", parentCode: "4402" },
      { code: "440204", name: "금성동", parentCode: "4402" },
      { code: "440205", name: "옥룡동", parentCode: "4402" },
      { code: "440206", name: "신관동", parentCode: "4402" },
      { code: "440207", name: "월송동", parentCode: "4402" },
      { code: "440208", name: "신관동", parentCode: "4402" },
      { code: "440209", name: "월송동", parentCode: "4402" },
      { code: "440210", name: "신관동", parentCode: "4402" },
      { code: "440211", name: "월송동", parentCode: "4402" },
      { code: "440212", name: "신관동", parentCode: "4402" },
      { code: "440213", name: "월송동", parentCode: "4402" },
      { code: "440214", name: "신관동", parentCode: "4402" },
      { code: "440215", name: "월송동", parentCode: "4402" },
      { code: "440216", name: "신관동", parentCode: "4402" },
      { code: "440217", name: "월송동", parentCode: "4402" },
      { code: "440218", name: "신관동", parentCode: "4402" },
      { code: "440219", name: "월송동", parentCode: "4402" },
      { code: "440220", name: "신관동", parentCode: "4402" },
    ]
  }
  
  if (parentCode === "4403") {
    return [
      { code: "440301", name: "보령동", parentCode: "4403" },
      { code: "440302", name: "죽정동", parentCode: "4403" },
      { code: "440303", name: "화산동", parentCode: "4403" },
      { code: "440304", name: "동대동", parentCode: "4403" },
      { code: "440305", name: "명천동", parentCode: "4403" },
      { code: "440306", name: "청소동", parentCode: "4403" },
      { code: "440307", name: "신흑동", parentCode: "4403" },
      { code: "440308", name: "죽정동", parentCode: "4403" },
      { code: "440309", name: "화산동", parentCode: "4403" },
      { code: "440310", name: "동대동", parentCode: "4403" },
      { code: "440311", name: "명천동", parentCode: "4403" },
      { code: "440312", name: "청소동", parentCode: "4403" },
      { code: "440313", name: "신흑동", parentCode: "4403" },
      { code: "440314", name: "죽정동", parentCode: "4403" },
      { code: "440315", name: "화산동", parentCode: "4403" },
      { code: "440316", name: "동대동", parentCode: "4403" },
      { code: "440317", name: "명천동", parentCode: "4403" },
      { code: "440318", name: "청소동", parentCode: "4403" },
      { code: "440319", name: "신흑동", parentCode: "4403" },
      { code: "440320", name: "죽정동", parentCode: "4403" },
    ]
  }
  
  if (parentCode === "4404") {
    return [
      { code: "440401", name: "아산동", parentCode: "4404" },
      { code: "440402", name: "신창동", parentCode: "4404" },
      { code: "440403", name: "온양1동", parentCode: "4404" },
      { code: "440404", name: "온양2동", parentCode: "4404" },
      { code: "440405", name: "온양3동", parentCode: "4404" },
      { code: "440406", name: "온양4동", parentCode: "4404" },
      { code: "440407", name: "온양5동", parentCode: "4404" },
      { code: "440408", name: "온양6동", parentCode: "4404" },
      { code: "440409", name: "신창동", parentCode: "4404" },
      { code: "440410", name: "온양1동", parentCode: "4404" },
      { code: "440411", name: "온양2동", parentCode: "4404" },
      { code: "440412", name: "온양3동", parentCode: "4404" },
      { code: "440413", name: "온양4동", parentCode: "4404" },
      { code: "440414", name: "온양5동", parentCode: "4404" },
      { code: "440415", name: "온양6동", parentCode: "4404" },
      { code: "440416", name: "신창동", parentCode: "4404" },
      { code: "440417", name: "온양1동", parentCode: "4404" },
      { code: "440418", name: "온양2동", parentCode: "4404" },
      { code: "440419", name: "온양3동", parentCode: "4404" },
      { code: "440420", name: "온양4동", parentCode: "4404" },
    ]
  }
  
  if (parentCode === "4405") {
    return [
      { code: "440501", name: "서산동", parentCode: "4405" },
      { code: "440502", name: "지곡동", parentCode: "4405" },
      { code: "440503", name: "부춘동", parentCode: "4405" },
      { code: "440504", name: "동문동", parentCode: "4405" },
      { code: "440505", name: "수석동", parentCode: "4405" },
      { code: "440506", name: "석림동", parentCode: "4405" },
      { code: "440507", name: "지곡동", parentCode: "4405" },
      { code: "440508", name: "부춘동", parentCode: "4405" },
      { code: "440509", name: "동문동", parentCode: "4405" },
      { code: "440510", name: "수석동", parentCode: "4405" },
      { code: "440511", name: "석림동", parentCode: "4405" },
      { code: "440512", name: "지곡동", parentCode: "4405" },
      { code: "440513", name: "부춘동", parentCode: "4405" },
      { code: "440514", name: "동문동", parentCode: "4405" },
      { code: "440515", name: "수석동", parentCode: "4405" },
      { code: "440516", name: "석림동", parentCode: "4405" },
      { code: "440517", name: "지곡동", parentCode: "4405" },
      { code: "440518", name: "부춘동", parentCode: "4405" },
      { code: "440519", name: "동문동", parentCode: "4405" },
      { code: "440520", name: "수석동", parentCode: "4405" },
    ]
  }
  
  // 충청남도 동/읍/면
  if (parentCode === "4401") {
    return [
      { code: "440101", name: "동남구", parentCode: "4401" },
      { code: "440102", name: "서북구", parentCode: "4401" },
    ]
  }
  
  // 전북특별자치도 동/읍/면
  if (parentCode === "4501") {
    return [
      { code: "450101", name: "완산구", parentCode: "4501" },
      { code: "450102", name: "덕진구", parentCode: "4501" },
    ]
  }
  
  if (parentCode === "4502") {
    return [
      { code: "450201", name: "군산동", parentCode: "4502" },
      { code: "450202", name: "수송동", parentCode: "4502" },
      { code: "450203", name: "나운1동", parentCode: "4502" },
      { code: "450204", name: "나운2동", parentCode: "4502" },
      { code: "450205", name: "나운3동", parentCode: "4502" },
      { code: "450206", name: "소룡동", parentCode: "4502" },
      { code: "450207", name: "미성동", parentCode: "4502" },
      { code: "450208", name: "신풍동", parentCode: "4502" },
      { code: "450209", name: "송풍동", parentCode: "4502" },
      { code: "450210", name: "대명동", parentCode: "4502" },
      { code: "450211", name: "해망동", parentCode: "4502" },
      { code: "450212", name: "신흥동", parentCode: "4502" },
      { code: "450213", name: "금광동", parentCode: "4502" },
      { code: "450214", name: "월명동", parentCode: "4502" },
      { code: "450215", name: "신창동", parentCode: "4502" },
      { code: "450216", name: "오룡동", parentCode: "4502" },
      { code: "450217", name: "금광동", parentCode: "4502" },
      { code: "450218", name: "월명동", parentCode: "4502" },
      { code: "450219", name: "신창동", parentCode: "4502" },
      { code: "450220", name: "오룡동", parentCode: "4502" },
    ]
  }
  
  if (parentCode === "4503") {
    return [
      { code: "450301", name: "익산동", parentCode: "4503" },
      { code: "450302", name: "마동", parentCode: "4503" },
      { code: "450303", name: "팔봉동", parentCode: "4503" },
      { code: "450304", name: "삼성동", parentCode: "4503" },
      { code: "450305", name: "신동", parentCode: "4503" },
      { code: "450306", name: "영등1동", parentCode: "4503" },
      { code: "450307", name: "영등2동", parentCode: "4503" },
      { code: "450308", name: "어양동", parentCode: "4503" },
      { code: "450309", name: "중앙동", parentCode: "4503" },
      { code: "450310", name: "평화동", parentCode: "4503" },
      { code: "450311", name: "인화동", parentCode: "4503" },
      { code: "450312", name: "동산동", parentCode: "4503" },
      { code: "450313", name: "마동", parentCode: "4503" },
      { code: "450314", name: "팔봉동", parentCode: "4503" },
      { code: "450315", name: "삼성동", parentCode: "4503" },
      { code: "450316", name: "신동", parentCode: "4503" },
      { code: "450317", name: "영등1동", parentCode: "4503" },
      { code: "450318", name: "영등2동", parentCode: "4503" },
      { code: "450319", name: "어양동", parentCode: "4503" },
      { code: "450320", name: "중앙동", parentCode: "4503" },
    ]
  }
  
  
  if (parentCode === "4602") {
    return [
      { code: "460201", name: "여수동", parentCode: "4602" },
      { code: "460202", name: "중앙동", parentCode: "4602" },
      { code: "460203", name: "한려동", parentCode: "4602" },
      { code: "460204", name: "충무동", parentCode: "4602" },
      { code: "460205", name: "광림동", parentCode: "4602" },
      { code: "460206", name: "서강동", parentCode: "4602" },
      { code: "460207", name: "대교동", parentCode: "4602" },
      { code: "460208", name: "국동동", parentCode: "4602" },
      { code: "460209", name: "월호동", parentCode: "4602" },
      { code: "460210", name: "여서동", parentCode: "4602" },
      { code: "460211", name: "문수동", parentCode: "4602" },
      { code: "460212", name: "미평동", parentCode: "4602" },
      { code: "460213", name: "중앙동", parentCode: "4602" },
      { code: "460214", name: "한려동", parentCode: "4602" },
      { code: "460215", name: "충무동", parentCode: "4602" },
      { code: "460216", name: "광림동", parentCode: "4602" },
      { code: "460217", name: "서강동", parentCode: "4602" },
      { code: "460218", name: "대교동", parentCode: "4602" },
      { code: "460219", name: "국동동", parentCode: "4602" },
      { code: "460220", name: "월호동", parentCode: "4602" },
    ]
  }
  
  if (parentCode === "4603") {
    return [
      { code: "460301", name: "순천동", parentCode: "4603" },
      { code: "460302", name: "조례동", parentCode: "4603" },
      { code: "460303", name: "완사동", parentCode: "4603" },
      { code: "460304", name: "연향동", parentCode: "4603" },
      { code: "460305", name: "풍덕동", parentCode: "4603" },
      { code: "460306", name: "남제동", parentCode: "4603" },
      { code: "460307", name: "저전동", parentCode: "4603" },
      { code: "460308", name: "장천동", parentCode: "4603" },
      { code: "460309", name: "중앙동", parentCode: "4603" },
      { code: "460310", name: "도사동", parentCode: "4603" },
      { code: "460311", name: "조례동", parentCode: "4603" },
      { code: "460312", name: "완사동", parentCode: "4603" },
      { code: "460313", name: "연향동", parentCode: "4603" },
      { code: "460314", name: "풍덕동", parentCode: "4603" },
      { code: "460315", name: "남제동", parentCode: "4603" },
      { code: "460316", name: "저전동", parentCode: "4603" },
      { code: "460317", name: "장천동", parentCode: "4603" },
      { code: "460318", name: "중앙동", parentCode: "4603" },
      { code: "460319", name: "도사동", parentCode: "4603" },
      { code: "460320", name: "조례동", parentCode: "4603" },
    ]
  }
  
  // 경상북도 동/읍/면
  if (parentCode === "4701") {
    return [
      { code: "470101", name: "남구", parentCode: "4701" },
      { code: "470102", name: "북구", parentCode: "4701" },
    ]
  }
  
  if (parentCode === "4702") {
    return [
      { code: "470201", name: "경주동", parentCode: "4702" },
      { code: "470202", name: "동천동", parentCode: "4702" },
      { code: "470203", name: "서천동", parentCode: "4702" },
      { code: "470204", name: "중부동", parentCode: "4702" },
      { code: "470205", name: "황오동", parentCode: "4702" },
      { code: "470206", name: "성건동", parentCode: "4702" },
      { code: "470207", name: "황남동", parentCode: "4702" },
      { code: "470208", name: "동천동", parentCode: "4702" },
      { code: "470209", name: "서천동", parentCode: "4702" },
      { code: "470210", name: "중부동", parentCode: "4702" },
      { code: "470211", name: "황오동", parentCode: "4702" },
      { code: "470212", name: "성건동", parentCode: "4702" },
      { code: "470213", name: "황남동", parentCode: "4702" },
      { code: "470214", name: "동천동", parentCode: "4702" },
      { code: "470215", name: "서천동", parentCode: "4702" },
      { code: "470216", name: "중부동", parentCode: "4702" },
      { code: "470217", name: "황오동", parentCode: "4702" },
      { code: "470218", name: "성건동", parentCode: "4702" },
      { code: "470219", name: "황남동", parentCode: "4702" },
      { code: "470220", name: "동천동", parentCode: "4702" },
    ]
  }
  
  if (parentCode === "4703") {
    return [
      { code: "470301", name: "김천동", parentCode: "4703" },
      { code: "470302", name: "자산동", parentCode: "4703" },
      { code: "470303", name: "평화남산동", parentCode: "4703" },
      { code: "470304", name: "양금동", parentCode: "4703" },
      { code: "470305", name: "대신동", parentCode: "4703" },
      { code: "470306", name: "대곡동", parentCode: "4703" },
      { code: "470307", name: "지좌동", parentCode: "4703" },
      { code: "470308", name: "율곡동", parentCode: "4703" },
      { code: "470309", name: "자산동", parentCode: "4703" },
      { code: "470310", name: "평화남산동", parentCode: "4703" },
      { code: "470311", name: "양금동", parentCode: "4703" },
      { code: "470312", name: "대신동", parentCode: "4703" },
      { code: "470313", name: "대곡동", parentCode: "4703" },
      { code: "470314", name: "지좌동", parentCode: "4703" },
      { code: "470315", name: "율곡동", parentCode: "4703" },
      { code: "470316", name: "자산동", parentCode: "4703" },
      { code: "470317", name: "평화남산동", parentCode: "4703" },
      { code: "470318", name: "양금동", parentCode: "4703" },
      { code: "470319", name: "대신동", parentCode: "4703" },
      { code: "470320", name: "대곡동", parentCode: "4703" },
    ]
  }
  
  // 경상남도 동/읍/면
  if (parentCode === "4801") {
    return [
      { code: "480101", name: "의창구", parentCode: "4801" },
      { code: "480102", name: "성산구", parentCode: "4801" },
      { code: "480103", name: "마산합포구", parentCode: "4801" },
      { code: "480104", name: "마산회원구", parentCode: "4801" },
      { code: "480105", name: "진해구", parentCode: "4801" },
    ]
  }
  
  if (parentCode === "4802") {
    return [
      { code: "480201", name: "진주동", parentCode: "4802" },
      { code: "480202", name: "명석동", parentCode: "4802" },
      { code: "480203", name: "금성동", parentCode: "4802" },
      { code: "480204", name: "성지동", parentCode: "4802" },
      { code: "480205", name: "봉곡동", parentCode: "4802" },
      { code: "480206", name: "상평동", parentCode: "4802" },
      { code: "480207", name: "하대동", parentCode: "4802" },
      { code: "480208", name: "상대동", parentCode: "4802" },
      { code: "480209", name: "명석동", parentCode: "4802" },
      { code: "480210", name: "금성동", parentCode: "4802" },
      { code: "480211", name: "성지동", parentCode: "4802" },
      { code: "480212", name: "봉곡동", parentCode: "4802" },
      { code: "480213", name: "상평동", parentCode: "4802" },
      { code: "480214", name: "하대동", parentCode: "4802" },
      { code: "480215", name: "상대동", parentCode: "4802" },
      { code: "480216", name: "명석동", parentCode: "4802" },
      { code: "480217", name: "금성동", parentCode: "4802" },
      { code: "480218", name: "성지동", parentCode: "4802" },
      { code: "480219", name: "봉곡동", parentCode: "4802" },
      { code: "480220", name: "상평동", parentCode: "4802" },
    ]
  }
  
  if (parentCode === "4803") {
    return [
      { code: "480301", name: "통영동", parentCode: "4803" },
      { code: "480302", name: "중앙동", parentCode: "4803" },
      { code: "480303", name: "정량동", parentCode: "4803" },
      { code: "480304", name: "북신동", parentCode: "4803" },
      { code: "480305", name: "미수동", parentCode: "4803" },
      { code: "480306", name: "봉평동", parentCode: "4803" },
      { code: "480307", name: "무전동", parentCode: "4803" },
      { code: "480308", name: "중앙동", parentCode: "4803" },
      { code: "480309", name: "정량동", parentCode: "4803" },
      { code: "480310", name: "북신동", parentCode: "4803" },
      { code: "480311", name: "미수동", parentCode: "4803" },
      { code: "480312", name: "봉평동", parentCode: "4803" },
      { code: "480313", name: "무전동", parentCode: "4803" },
      { code: "480314", name: "중앙동", parentCode: "4803" },
      { code: "480315", name: "정량동", parentCode: "4803" },
      { code: "480316", name: "북신동", parentCode: "4803" },
      { code: "480317", name: "미수동", parentCode: "4803" },
      { code: "480318", name: "봉평동", parentCode: "4803" },
      { code: "480319", name: "무전동", parentCode: "4803" },
      { code: "480320", name: "중앙동", parentCode: "4803" },
    ]
  }
  
  // 제주특별자치도 동/읍/면
  if (parentCode === "4901") {
    return [
      { code: "490101", name: "일도1동", parentCode: "4901" },
      { code: "490102", name: "일도2동", parentCode: "4901" },
      { code: "490103", name: "이도1동", parentCode: "4901" },
      { code: "490104", name: "이도2동", parentCode: "4901" },
      { code: "490105", name: "삼도1동", parentCode: "4901" },
      { code: "490106", name: "삼도2동", parentCode: "4901" },
      { code: "490107", name: "용담1동", parentCode: "4901" },
      { code: "490108", name: "용담2동", parentCode: "4901" },
      { code: "490109", name: "건입동", parentCode: "4901" },
      { code: "490110", name: "화북동", parentCode: "4901" },
      { code: "490111", name: "삼양동", parentCode: "4901" },
      { code: "490112", name: "봉개동", parentCode: "4901" },
      { code: "490113", name: "아라동", parentCode: "4901" },
      { code: "490114", name: "오라동", parentCode: "4901" },
      { code: "490115", name: "연동", parentCode: "4901" },
      { code: "490116", name: "노형동", parentCode: "4901" },
      { code: "490117", name: "외도동", parentCode: "4901" },
      { code: "490118", name: "이호동", parentCode: "4901" },
      { code: "490119", name: "도두동", parentCode: "4901" },
      { code: "490120", name: "일도1동", parentCode: "4901" },
    ]
  }
  
  if (parentCode === "4902") {
    return [
      { code: "490201", name: "서귀동", parentCode: "4902" },
      { code: "490202", name: "법환동", parentCode: "4902" },
      { code: "490203", name: "호근동", parentCode: "4902" },
      { code: "490204", name: "동홍동", parentCode: "4902" },
      { code: "490205", name: "서홍동", parentCode: "4902" },
      { code: "490206", name: "상효동", parentCode: "4902" },
      { code: "490207", name: "하효동", parentCode: "4902" },
      { code: "490208", name: "신효동", parentCode: "4902" },
      { code: "490209", name: "보목동", parentCode: "4902" },
      { code: "490210", name: "토평동", parentCode: "4902" },
      { code: "490211", name: "중문동", parentCode: "4902" },
      { code: "490212", name: "회수동", parentCode: "4902" },
      { code: "490213", name: "대정읍", parentCode: "4902" },
      { code: "490214", name: "남원읍", parentCode: "4902" },
      { code: "490215", name: "성산읍", parentCode: "4902" },
      { code: "490216", name: "안덕면", parentCode: "4902" },
      { code: "490217", name: "표선면", parentCode: "4902" },
      { code: "490218", name: "서귀동", parentCode: "4902" },
      { code: "490219", name: "법환동", parentCode: "4902" },
      { code: "490220", name: "호근동", parentCode: "4902" },
    ]
  }
  
  // 전라남도 동/읍/면
  if (parentCode === "4601") {
    return [
      { code: "460101", name: "용당1동", parentCode: "4601" },
      { code: "460102", name: "용당2동", parentCode: "4601" },
      { code: "460103", name: "연동", parentCode: "4601" },
      { code: "460104", name: "산정동", parentCode: "4601" },
      { code: "460105", name: "대성동", parentCode: "4601" },
      { code: "460106", name: "양동", parentCode: "4601" },
      { code: "460107", name: "북교동", parentCode: "4601" },
      { code: "460108", name: "남교동", parentCode: "4601" },
      { code: "460109", name: "무안동", parentCode: "4601" },
      { code: "460110", name: "삼학동", parentCode: "4601" },
      { code: "460111", name: "옥암동", parentCode: "4601" },
      { code: "460112", name: "신흥동", parentCode: "4601" },
      { code: "460113", name: "부흥동", parentCode: "4601" },
      { code: "460114", name: "해안동", parentCode: "4601" },
      { code: "460115", name: "삼향동", parentCode: "4601" },
      { code: "460116", name: "옥도동", parentCode: "4601" },
      { code: "460117", name: "신창동", parentCode: "4601" },
    ]
  }
  
  // 경상북도 동/읍/면
  if (parentCode === "4701") {
    return [
      { code: "470101", name: "남구", parentCode: "4701" },
      { code: "470102", name: "북구", parentCode: "4701" },
    ]
  }
  
  // 경상남도 동/읍/면
  if (parentCode === "4801") {
    return [
      { code: "480101", name: "의창구", parentCode: "4801" },
      { code: "480102", name: "성산구", parentCode: "4801" },
      { code: "480103", name: "마산합포구", parentCode: "4801" },
      { code: "480104", name: "마산회원구", parentCode: "4801" },
      { code: "480105", name: "진해구", parentCode: "4801" },
    ]
  }
  
  // 제주특별자치도 동/읍/면
  if (parentCode === "4901") {
    return [
      { code: "490101", name: "일도1동", parentCode: "4901" },
      { code: "490102", name: "일도2동", parentCode: "4901" },
      { code: "490103", name: "이도1동", parentCode: "4901" },
      { code: "490104", name: "이도2동", parentCode: "4901" },
      { code: "490105", name: "삼도1동", parentCode: "4901" },
      { code: "490106", name: "삼도2동", parentCode: "4901" },
      { code: "490107", name: "용담1동", parentCode: "4901" },
      { code: "490108", name: "용담2동", parentCode: "4901" },
      { code: "490109", name: "건입동", parentCode: "4901" },
      { code: "490110", name: "화북동", parentCode: "4901" },
      { code: "490111", name: "삼양동", parentCode: "4901" },
      { code: "490112", name: "봉개동", parentCode: "4901" },
      { code: "490113", name: "아라동", parentCode: "4901" },
      { code: "490114", name: "오라동", parentCode: "4901" },
      { code: "490115", name: "연동", parentCode: "4901" },
      { code: "490116", name: "노형동", parentCode: "4901" },
      { code: "490117", name: "외도동", parentCode: "4901" },
      { code: "490118", name: "이호동", parentCode: "4901" },
      { code: "490119", name: "도두동", parentCode: "4901" },
    ]
  }
  
  if (parentCode === "4902") {
    return [
      { code: "490201", name: "서귀동", parentCode: "4902" },
      { code: "490202", name: "법환동", parentCode: "4902" },
      { code: "490203", name: "호근동", parentCode: "4902" },
      { code: "490204", name: "동홍동", parentCode: "4902" },
      { code: "490205", name: "서홍동", parentCode: "4902" },
      { code: "490206", name: "상효동", parentCode: "4902" },
      { code: "490207", name: "하효동", parentCode: "4902" },
      { code: "490208", name: "신효동", parentCode: "4902" },
      { code: "490209", name: "보목동", parentCode: "4902" },
      { code: "490210", name: "토평동", parentCode: "4902" },
      { code: "490211", name: "중문동", parentCode: "4902" },
      { code: "490212", name: "회수동", parentCode: "4902" },
      { code: "490213", name: "대정읍", parentCode: "4902" },
      { code: "490214", name: "남원읍", parentCode: "4902" },
      { code: "490215", name: "성산읍", parentCode: "4902" },
      { code: "490216", name: "안덕면", parentCode: "4902" },
      { code: "490217", name: "표선면", parentCode: "4902" },
    ]
  }
  
  // 부산광역시 나머지 구/군 동/읍/면 데이터 추가
  if (parentCode === "2602") {
    return [
      { code: "260201", name: "대신동", parentCode: "2602" },
      { code: "260202", name: "동대신1동", parentCode: "2602" },
      { code: "260203", name: "동대신2동", parentCode: "2602" },
      { code: "260204", name: "동대신3동", parentCode: "2602" },
      { code: "260205", name: "서대신1동", parentCode: "2602" },
      { code: "260206", name: "서대신3동", parentCode: "2602" },
      { code: "260207", name: "서대신4동", parentCode: "2602" },
      { code: "260208", name: "부민동", parentCode: "2602" },
      { code: "260209", name: "아미동", parentCode: "2602" },
      { code: "260210", name: "초장동", parentCode: "2602" },
      { code: "260211", name: "남부민1동", parentCode: "2602" },
      { code: "260212", name: "남부민2동", parentCode: "2602" },
      { code: "260213", name: "암남동", parentCode: "2602" },
    ]
  }
  
  if (parentCode === "2603") {
    return [
      { code: "260301", name: "초량1동", parentCode: "2603" },
      { code: "260302", name: "초량2동", parentCode: "2603" },
      { code: "260303", name: "초량3동", parentCode: "2603" },
      { code: "260304", name: "초량6동", parentCode: "2603" },
      { code: "260305", name: "수정1동", parentCode: "2603" },
      { code: "260306", name: "수정2동", parentCode: "2603" },
      { code: "260307", name: "수정4동", parentCode: "2603" },
      { code: "260308", name: "수정5동", parentCode: "2603" },
      { code: "260309", name: "좌천동", parentCode: "2603" },
      { code: "260310", name: "범일1동", parentCode: "2603" },
      { code: "260311", name: "범일2동", parentCode: "2603" },
      { code: "260312", name: "범일5동", parentCode: "2603" },
    ]
  }
  
  if (parentCode === "2604") {
    return [
      { code: "260401", name: "남항동", parentCode: "2604" },
      { code: "260402", name: "영선1동", parentCode: "2604" },
      { code: "260403", name: "영선2동", parentCode: "2604" },
      { code: "260404", name: "신선동", parentCode: "2604" },
      { code: "260405", name: "봉래1동", parentCode: "2604" },
      { code: "260406", name: "봉래2동", parentCode: "2604" },
      { code: "260407", name: "청학1동", parentCode: "2604" },
      { code: "260408", name: "청학2동", parentCode: "2604" },
      { code: "260409", name: "동삼1동", parentCode: "2604" },
      { code: "260410", name: "동삼2동", parentCode: "2604" },
      { code: "260411", name: "동삼3동", parentCode: "2604" },
    ]
  }
  
  if (parentCode === "2605") {
    return [
      { code: "260501", name: "부산진1동", parentCode: "2605" },
      { code: "260502", name: "부산진2동", parentCode: "2605" },
      { code: "260503", name: "부산진3동", parentCode: "2605" },
      { code: "260504", name: "부산진4동", parentCode: "2605" },
      { code: "260505", name: "부산진5동", parentCode: "2605" },
      { code: "260506", name: "전포1동", parentCode: "2605" },
      { code: "260507", name: "전포2동", parentCode: "2605" },
      { code: "260508", name: "전포3동", parentCode: "2605" },
      { code: "260509", name: "범천1동", parentCode: "2605" },
      { code: "260510", name: "범천2동", parentCode: "2605" },
      { code: "260511", name: "범천4동", parentCode: "2605" },
      { code: "260512", name: "범천5동", parentCode: "2605" },
      { code: "260513", name: "가야1동", parentCode: "2605" },
      { code: "260514", name: "가야2동", parentCode: "2605" },
      { code: "260515", name: "개금1동", parentCode: "2605" },
      { code: "260516", name: "개금2동", parentCode: "2605" },
      { code: "260517", name: "개금3동", parentCode: "2605" },
    ]
  }
  
  if (parentCode === "2606") {
    return [
      { code: "260601", name: "수정1동", parentCode: "2606" },
      { code: "260602", name: "수정2동", parentCode: "2606" },
      { code: "260603", name: "수정3동", parentCode: "2606" },
      { code: "260604", name: "수정4동", parentCode: "2606" },
      { code: "260605", name: "수정5동", parentCode: "2606" },
      { code: "260606", name: "명장1동", parentCode: "2606" },
      { code: "260607", name: "명장2동", parentCode: "2606" },
      { code: "260608", name: "온천1동", parentCode: "2606" },
      { code: "260609", name: "온천2동", parentCode: "2606" },
      { code: "260610", name: "온천3동", parentCode: "2606" },
      { code: "260611", name: "사직1동", parentCode: "2606" },
      { code: "260612", name: "사직2동", parentCode: "2606" },
      { code: "260613", name: "사직3동", parentCode: "2606" },
      { code: "260614", name: "안락1동", parentCode: "2606" },
      { code: "260615", name: "안락2동", parentCode: "2606" },
      { code: "260616", name: "명일1동", parentCode: "2606" },
      { code: "260617", name: "명일2동", parentCode: "2606" },
    ]
  }
  
  if (parentCode === "2607") {
    return [
      { code: "260701", name: "대연1동", parentCode: "2607" },
      { code: "260702", name: "대연3동", parentCode: "2607" },
      { code: "260703", name: "대연4동", parentCode: "2607" },
      { code: "260704", name: "대연5동", parentCode: "2607" },
      { code: "260705", name: "대연6동", parentCode: "2607" },
      { code: "260706", name: "용호1동", parentCode: "2607" },
      { code: "260707", name: "용호2동", parentCode: "2607" },
      { code: "260708", name: "용호3동", parentCode: "2607" },
      { code: "260709", name: "용호4동", parentCode: "2607" },
      { code: "260710", name: "용당동", parentCode: "2607" },
      { code: "260711", name: "감만1동", parentCode: "2607" },
      { code: "260712", name: "감만2동", parentCode: "2607" },
      { code: "260713", name: "우암동", parentCode: "2607" },
      { code: "260714", name: "문현1동", parentCode: "2607" },
      { code: "260715", name: "문현2동", parentCode: "2607" },
      { code: "260716", name: "문현3동", parentCode: "2607" },
      { code: "260717", name: "문현4동", parentCode: "2607" },
    ]
  }
  
  if (parentCode === "2608") {
    return [
      { code: "260801", name: "남천1동", parentCode: "2608" },
      { code: "260802", name: "남천2동", parentCode: "2608" },
      { code: "260803", name: "수영동", parentCode: "2608" },
      { code: "260804", name: "망미1동", parentCode: "2608" },
      { code: "260805", name: "망미2동", parentCode: "2608" },
      { code: "260806", name: "광안1동", parentCode: "2608" },
      { code: "260807", name: "광안2동", parentCode: "2608" },
      { code: "260808", name: "광안3동", parentCode: "2608" },
      { code: "260809", name: "광안4동", parentCode: "2608" },
      { code: "260810", name: "민락동", parentCode: "2608" },
    ]
  }
  
  if (parentCode === "2610") {
    return [
      { code: "261001", name: "대저1동", parentCode: "2610" },
      { code: "261002", name: "대저2동", parentCode: "2610" },
      { code: "261003", name: "강서동", parentCode: "2610" },
      { code: "261004", name: "명지1동", parentCode: "2610" },
      { code: "261005", name: "명지2동", parentCode: "2610" },
      { code: "261006", name: "가락동", parentCode: "2610" },
      { code: "261007", name: "녹산동", parentCode: "2610" },
      { code: "261008", name: "가덕도동", parentCode: "2610" },
    ]
  }
  
  if (parentCode === "2611") {
    return [
      { code: "261101", name: "금성동", parentCode: "2611" },
      { code: "261102", name: "남산동", parentCode: "2611" },
      { code: "261103", name: "연산1동", parentCode: "2611" },
      { code: "261104", name: "연산2동", parentCode: "2611" },
      { code: "261105", name: "연산3동", parentCode: "2611" },
      { code: "261106", name: "연산4동", parentCode: "2611" },
      { code: "261107", name: "연산5동", parentCode: "2611" },
      { code: "261108", name: "연산6동", parentCode: "2611" },
      { code: "261109", name: "연산8동", parentCode: "2611" },
      { code: "261110", name: "연산9동", parentCode: "2611" },
    ]
  }
  
  if (parentCode === "2612") {
    return [
      { code: "261201", name: "당리동", parentCode: "2612" },
      { code: "261202", name: "하단1동", parentCode: "2612" },
      { code: "261203", name: "하단2동", parentCode: "2612" },
      { code: "261204", name: "신평1동", parentCode: "2612" },
      { code: "261205", name: "신평2동", parentCode: "2612" },
      { code: "261206", name: "장림1동", parentCode: "2612" },
      { code: "261207", name: "장림2동", parentCode: "2612" },
      { code: "261208", name: "구평동", parentCode: "2612" },
      { code: "261209", name: "감천1동", parentCode: "2612" },
      { code: "261210", name: "감천2동", parentCode: "2612" },
      { code: "261211", name: "괴정1동", parentCode: "2612" },
      { code: "261212", name: "괴정2동", parentCode: "2612" },
      { code: "261213", name: "괴정3동", parentCode: "2612" },
      { code: "261214", name: "괴정4동", parentCode: "2612" },
      { code: "261215", name: "사상1동", parentCode: "2612" },
      { code: "261216", name: "사상2동", parentCode: "2612" },
      { code: "261217", name: "사상3동", parentCode: "2612" },
      { code: "261218", name: "사상4동", parentCode: "2612" },
      { code: "261219", name: "사상5동", parentCode: "2612" },
    ]
  }
  
  if (parentCode === "2613") {
    return [
      { code: "261301", name: "기장읍", parentCode: "2613" },
      { code: "261302", name: "장안읍", parentCode: "2613" },
      { code: "261303", name: "정관읍", parentCode: "2613" },
      { code: "261304", name: "일광읍", parentCode: "2613" },
      { code: "261305", name: "철마면", parentCode: "2613" },
    ]
  }
  
  if (parentCode === "2614") {
    return [
      { code: "261401", name: "중앙동", parentCode: "2614" },
      { code: "261402", name: "동부동", parentCode: "2614" },
      { code: "261403", name: "서부동", parentCode: "2614" },
      { code: "261404", name: "북부동", parentCode: "2614" },
      { code: "261405", name: "남부동", parentCode: "2614" },
    ]
  }
  
  if (parentCode === "2615") {
    return [
      { code: "261501", name: "수영동", parentCode: "2615" },
      { code: "261502", name: "망미동", parentCode: "2615" },
      { code: "261503", name: "광안동", parentCode: "2615" },
      { code: "261504", name: "민락동", parentCode: "2615" },
    ]
  }
  
  if (parentCode === "2616") {
    return [
      { code: "261601", name: "대저1동", parentCode: "2616" },
      { code: "261602", name: "대저2동", parentCode: "2616" },
      { code: "261603", name: "강서동", parentCode: "2616" },
      { code: "261604", name: "명지동", parentCode: "2616" },
      { code: "261605", name: "가락동", parentCode: "2616" },
      { code: "261606", name: "녹산동", parentCode: "2616" },
      { code: "261607", name: "가덕도동", parentCode: "2616" },
    ]
  }

  // 대구광역시 모든 구/군 동/읍/면 데이터 추가
  if (parentCode === "2701") {
    return [
      { code: "270101", name: "동인동", parentCode: "2701" },
      { code: "270102", name: "삼덕동", parentCode: "2701" },
      { code: "270103", name: "성내1동", parentCode: "2701" },
      { code: "270104", name: "성내2동", parentCode: "2701" },
      { code: "270105", name: "성내3동", parentCode: "2701" },
      { code: "270106", name: "대신동", parentCode: "2701" },
      { code: "270107", name: "남산1동", parentCode: "2701" },
      { code: "270108", name: "남산2동", parentCode: "2701" },
      { code: "270109", name: "남산3동", parentCode: "2701" },
      { code: "270110", name: "남산4동", parentCode: "2701" },
      { code: "270111", name: "대봉1동", parentCode: "2701" },
      { code: "270112", name: "대봉2동", parentCode: "2701" },
    ]
  }
  
  if (parentCode === "2702") {
    return [
      { code: "270201", name: "신암1동", parentCode: "2702" },
      { code: "270202", name: "신암2동", parentCode: "2702" },
      { code: "270203", name: "신암3동", parentCode: "2702" },
      { code: "270204", name: "신암4동", parentCode: "2702" },
      { code: "270205", name: "신암5동", parentCode: "2702" },
      { code: "270206", name: "신천1동", parentCode: "2702" },
      { code: "270207", name: "신천2동", parentCode: "2702" },
      { code: "270208", name: "신천3동", parentCode: "2702" },
      { code: "270209", name: "신천4동", parentCode: "2702" },
      { code: "270210", name: "효목1동", parentCode: "2702" },
      { code: "270211", name: "효목2동", parentCode: "2702" },
      { code: "270212", name: "도평동", parentCode: "2702" },
      { code: "270213", name: "불로봉무동", parentCode: "2702" },
      { code: "270214", name: "지저동", parentCode: "2702" },
      { code: "270215", name: "동촌동", parentCode: "2702" },
      { code: "270216", name: "방촌동", parentCode: "2702" },
      { code: "270217", name: "해안동", parentCode: "2702" },
      { code: "270218", name: "공산동", parentCode: "2702" },
    ]
  }
  
  if (parentCode === "2703") {
    return [
      { code: "270301", name: "내당1동", parentCode: "2703" },
      { code: "270302", name: "내당2동", parentCode: "2703" },
      { code: "270303", name: "내당3동", parentCode: "2703" },
      { code: "270304", name: "내당4동", parentCode: "2703" },
      { code: "270305", name: "비산1동", parentCode: "2703" },
      { code: "270306", name: "비산2동", parentCode: "2703" },
      { code: "270307", name: "비산3동", parentCode: "2703" },
      { code: "270308", name: "비산4동", parentCode: "2703" },
      { code: "270309", name: "비산5동", parentCode: "2703" },
      { code: "270310", name: "비산6동", parentCode: "2703" },
      { code: "270311", name: "비산7동", parentCode: "2703" },
      { code: "270312", name: "평리1동", parentCode: "2703" },
      { code: "270313", name: "평리2동", parentCode: "2703" },
      { code: "270314", name: "평리3동", parentCode: "2703" },
      { code: "270315", name: "평리4동", parentCode: "2703" },
      { code: "270316", name: "평리5동", parentCode: "2703" },
      { code: "270317", name: "평리6동", parentCode: "2703" },
      { code: "270318", name: "상중이동", parentCode: "2703" },
      { code: "270319", name: "원대동", parentCode: "2703" },
    ]
  }
  
  if (parentCode === "2704") {
    return [
      { code: "270401", name: "이천동", parentCode: "2704" },
      { code: "270402", name: "봉덕1동", parentCode: "2704" },
      { code: "270403", name: "봉덕2동", parentCode: "2704" },
      { code: "270404", name: "봉덕3동", parentCode: "2704" },
      { code: "270405", name: "대명1동", parentCode: "2704" },
      { code: "270406", name: "대명2동", parentCode: "2704" },
      { code: "270407", name: "대명3동", parentCode: "2704" },
      { code: "270408", name: "대명4동", parentCode: "2704" },
      { code: "270409", name: "대명5동", parentCode: "2704" },
      { code: "270410", name: "대명6동", parentCode: "2704" },
      { code: "270411", name: "대명9동", parentCode: "2704" },
      { code: "270412", name: "대명10동", parentCode: "2704" },
      { code: "270413", name: "대명11동", parentCode: "2704" },
    ]
  }
  
  if (parentCode === "2705") {
    return [
      { code: "270501", name: "고성동", parentCode: "2705" },
      { code: "270502", name: "칠성동", parentCode: "2705" },
      { code: "270503", name: "침산1동", parentCode: "2705" },
      { code: "270504", name: "침산2동", parentCode: "2705" },
      { code: "270505", name: "침산3동", parentCode: "2705" },
      { code: "270506", name: "산격1동", parentCode: "2705" },
      { code: "270507", name: "산격2동", parentCode: "2705" },
      { code: "270508", name: "산격3동", parentCode: "2705" },
      { code: "270509", name: "산격4동", parentCode: "2705" },
      { code: "270510", name: "대현동", parentCode: "2705" },
      { code: "270511", name: "복현1동", parentCode: "2705" },
      { code: "270512", name: "복현2동", parentCode: "2705" },
      { code: "270513", name: "검단동", parentCode: "2705" },
      { code: "270514", name: "무태동", parentCode: "2705" },
      { code: "270515", name: "관문동", parentCode: "2705" },
      { code: "270516", name: "관음동", parentCode: "2705" },
      { code: "270517", name: "읍내동", parentCode: "2705" },
      { code: "270518", name: "동호동", parentCode: "2705" },
      { code: "270519", name: "학정동", parentCode: "2705" },
      { code: "270520", name: "도남동", parentCode: "2705" },
    ]
  }
  
  if (parentCode === "2706") {
    return [
      { code: "270601", name: "성당동", parentCode: "2706" },
      { code: "270602", name: "두류동", parentCode: "2706" },
      { code: "270603", name: "본리동", parentCode: "2706" },
      { code: "270604", name: "호산동", parentCode: "2706" },
      { code: "270605", name: "고산1동", parentCode: "2706" },
      { code: "270606", name: "고산2동", parentCode: "2706" },
      { code: "270607", name: "고산3동", parentCode: "2706" },
      { code: "270608", name: "이곡동", parentCode: "2706" },
      { code: "270609", name: "용산동", parentCode: "2706" },
      { code: "270610", name: "장기동", parentCode: "2706" },
      { code: "270611", name: "죽전동", parentCode: "2706" },
      { code: "270612", name: "감삼동", parentCode: "2706" },
      { code: "270613", name: "본동", parentCode: "2706" },
      { code: "270614", name: "상인1동", parentCode: "2706" },
      { code: "270615", name: "상인2동", parentCode: "2706" },
      { code: "270616", name: "상인3동", parentCode: "2706" },
      { code: "270617", name: "도원동", parentCode: "2706" },
      { code: "270618", name: "월성1동", parentCode: "2706" },
      { code: "270619", name: "월성2동", parentCode: "2706" },
      { code: "270620", name: "진천동", parentCode: "2706" },
      { code: "270621", name: "유천동", parentCode: "2706" },
    ]
  }
  
  if (parentCode === "2707") {
    return [
      { code: "270701", name: "내곡동", parentCode: "2707" },
      { code: "270702", name: "비산동", parentCode: "2707" },
      { code: "270703", name: "평리동", parentCode: "2707" },
      { code: "270704", name: "상중이동", parentCode: "2707" },
      { code: "270705", name: "원대동", parentCode: "2707" },
    ]
  }
  
  if (parentCode === "2708") {
    return [
      { code: "270801", name: "화원읍", parentCode: "2708" },
      { code: "270802", name: "논공읍", parentCode: "2708" },
      { code: "270803", name: "다사읍", parentCode: "2708" },
      { code: "270804", name: "가창면", parentCode: "2708" },
      { code: "270805", name: "하빈면", parentCode: "2708" },
      { code: "270806", name: "옥포면", parentCode: "2708" },
      { code: "270807", name: "현풍면", parentCode: "2708" },
      { code: "270808", name: "유가면", parentCode: "2708" },
      { code: "270809", name: "구지면", parentCode: "2708" },
    ]
  }

  return []
}


export default function RegionSearch({
  selectedRegions,
  onRegionsChange,
  placeholder = "지역명 검색 예) 서울, 서초구",
  className,
  regionOptions = [],
  isLoading = false
}: RegionSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  // API 데이터 상태
  const [cities, setCities] = useState<Region[]>([])
  const [districts, setDistricts] = useState<Region[]>([])
  const [neighborhoods, setNeighborhoods] = useState<Region[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 초기 시/도 데이터 로드
  useEffect(() => {
    const loadCities = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log('시/도 데이터 로드 시작')
        const data = await loadRegionsData()
        console.log('시/도 API 응답 데이터:', data)
        setCities(data)
      } catch (error) {
        console.error('시/도 API 호출 실패:', error)
        // 에러 발생시에도 기본 데이터가 표시됨 (fetchRegionsFromAPI에서 처리)
        setCities([])
      } finally {
        setLoading(false)
      }
    }
    
    loadCities()
  }, [])

  // 시/도 선택시 구/군 데이터 로드
  useEffect(() => {
    if (selectedCity) {
      const loadDistricts = async () => {
        setLoading(true)
        try {
          console.log('구/군 데이터 로드 시작:', selectedCity)
          const data = await loadRegionsData(selectedCity, selectedCity)
          console.log('API 응답 데이터:', data)
          
          // 구/군만 필터링 (동/읍/면 제외) 및 시/도 텍스트 제거
          const districtData = data.filter(region => {
            const name = region.name
            // 구/군 단위만 표시 (동, 읍, 면, 가가 포함되지 않은 것)
            return !name.includes('동') && 
                   !name.includes('읍') && 
                   !name.includes('면') && 
                   !name.includes('가') &&
                   !name.includes('로') &&
                   name.split(' ').length <= 2 // "서울특별시 종로구" 형태만
          }).map(region => ({
            ...region,
            name: region.name.split(' ').pop() || region.name // 마지막 부분만 사용 (구/군 이름만)
          }))
          console.log('필터링된 구/군 데이터:', districtData)
          
          setDistricts(districtData)
        } catch (error) {
          console.error('API 호출 실패:', error)
          setDistricts([])
        } finally {
          setLoading(false)
        }
      }
      
      loadDistricts()
    } else {
      setDistricts([])
    }
  }, [selectedCity])

  // 구/군 선택시 동/읍/면 데이터 로드
  useEffect(() => {
    if (selectedDistrict) {
      const loadNeighborhoods = async () => {
        setLoading(true)
        try {
          console.log('동/읍/면 데이터 로드 시작:', selectedDistrict)
          const data = await loadRegionsData(selectedDistrict, selectedCity)
          console.log('동/읍/면 API 응답 데이터:', data)
          
          // 동/읍/면만 필터링 (구/군 제외)
          const neighborhoodData = data.filter(region => {
            const name = region.name
            // 동, 읍, 면이 포함된 것만 표시
            return name.includes('동') || name.includes('읍') || name.includes('면')
          })
          console.log('필터링된 동/읍/면 데이터:', neighborhoodData)
          
          // API 데이터가 필터링되어 비어있으면 모의 데이터 사용
          if (neighborhoodData.length === 0) {
            console.log('API 데이터가 비어있음, 모의 데이터 사용')
            // API 코드를 모의 데이터 코드로 변환
            let mockCode = selectedDistrict
            if (selectedDistrict === "1114000000") mockCode = "1102" // 중구
            else if (selectedDistrict === "2611000000") mockCode = "2601" // 부산 중구
            else if (selectedDistrict === "1117000000") mockCode = "1105" // 광진구
            else if (selectedDistrict === "1120000000") mockCode = "1108" // 성북구
            else if (selectedDistrict === "1123000000") mockCode = "1111" // 도봉구
            else if (selectedDistrict === "1126000000") mockCode = "1114" // 노원구
            else if (selectedDistrict === "1129000000") mockCode = "1117" // 은평구
            else if (selectedDistrict === "1132000000") mockCode = "1120" // 서대문구
            else if (selectedDistrict === "1135000000") mockCode = "1123" // 마포구
            else if (selectedDistrict === "1138000000") mockCode = "1126" // 양천구
            else if (selectedDistrict === "1141000000") mockCode = "1129" // 강서구
            else if (selectedDistrict === "1144000000") mockCode = "1132" // 금천구
            else if (selectedDistrict === "1147000000") mockCode = "1135" // 영등포구
            else if (selectedDistrict === "1150000000") mockCode = "1138" // 관악구
            else if (selectedDistrict === "1153000000") mockCode = "1141" // 서초구
            else if (selectedDistrict === "1156000000") mockCode = "1144" // 강남구
            else if (selectedDistrict === "1159000000") mockCode = "1147" // 송파구
            else if (selectedDistrict === "1162000000") mockCode = "1150" // 강동구
            else if (selectedDistrict === "1165000000") mockCode = "1103" // 용산구
            else if (selectedDistrict === "1168000000") mockCode = "1104" // 성동구
            else if (selectedDistrict === "1171000000") mockCode = "1106" // 동대문구
            else if (selectedDistrict === "1174000000") mockCode = "1107" // 중랑구
            else if (selectedDistrict === "1177000000") mockCode = "1109" // 성북구
            else if (selectedDistrict === "1180000000") mockCode = "1110" // 강북구
            else if (selectedDistrict === "1183000000") mockCode = "1112" // 도봉구
            else if (selectedDistrict === "1186000000") mockCode = "1113" // 노원구
            else if (selectedDistrict === "1189000000") mockCode = "1115" // 은평구
            else if (selectedDistrict === "1192000000") mockCode = "1116" // 서대문구
            else if (selectedDistrict === "1195000000") mockCode = "1118" // 마포구
            else if (selectedDistrict === "1198000000") mockCode = "1119" // 양천구
            else if (selectedDistrict === "1201000000") mockCode = "1120" // 강서구
            else if (selectedDistrict === "1204000000") mockCode = "1121" // 금천구
            else if (selectedDistrict === "1207000000") mockCode = "1122" // 영등포구
            else if (selectedDistrict === "1210000000") mockCode = "1123" // 관악구
            else if (selectedDistrict === "1213000000") mockCode = "1124" // 서초구
            else if (selectedDistrict === "1216000000") mockCode = "1125" // 강남구
            else if (selectedDistrict === "1219000000") mockCode = "1126" // 송파구
            else if (selectedDistrict === "1222000000") mockCode = "1127" // 강동구
            
            const mockData = getDefaultRegionData(mockCode)
            console.log('변환된 코드:', mockCode, '모의 데이터:', mockData)
            setNeighborhoods(mockData)
          } else {
            setNeighborhoods(neighborhoodData)
          }
        } catch (error) {
          console.error('동/읍/면 API 호출 실패:', error)
          // API 실패 시 모의 데이터 사용
          const mockData = getDefaultRegionData(selectedDistrict)
          console.log('API 실패, 기본 동/읍/면 데이터 사용:', mockData)
          setNeighborhoods(mockData)
        } finally {
          setLoading(false)
        }
      }
      
      loadNeighborhoods()
    } else {
      setNeighborhoods([])
    }
  }, [selectedDistrict])

  // 검색어가 있을 때 모든 지역 데이터 로드
  useEffect(() => {
    const loadAllRegionsForSearch = async () => {
      if (searchTerm.trim() !== "") {
        setLoading(true)
        try {
          // 통합 지역 데이터 로드
          const allRegionData = await loadRegionData()
          
          // 검색 실행
          const searchResults = searchRegions(allRegionData, searchTerm)
          console.log('검색 결과:', searchResults)
          
          // 검색 결과를 각 레벨별로 분류
          const citiesSet = new Set<string>()
          const districtsSet = new Set<string>()
          const neighborhoodsSet = new Set<string>()
          
          searchResults.forEach(region => {
            console.log('지역 데이터:', region)
            citiesSet.add(region.sidonm)
            districtsSet.add(`${region.sidonm} ${region.sggNm}`)
            
            // 동읍면이 실제로 존재하는 경우만 neighborhoodsSet에 추가
            if (region.umdNm && region.umdNm.trim() !== '') {
              neighborhoodsSet.add(`${region.sidonm} ${region.sggNm} ${region.umdNm}`)
            }
          })
          
          console.log('분류된 데이터:', {
            cities: Array.from(citiesSet),
            districts: Array.from(districtsSet),
            neighborhoods: Array.from(neighborhoodsSet)
          })
          
          // 시도 데이터 설정
          const cities = Array.from(citiesSet).map(sido => ({
            code: sido,
            name: sido,
            parentCode: ""
          }))
          setCities(cities)
          
          // 시군구 데이터 설정
          const districts = Array.from(districtsSet).map(district => {
            const [sido, sgg] = district.split(' ')
            return {
              code: district, // 전체 경로를 code로 사용하여 고유성 보장
              name: sgg,
              parentCode: sido
            }
          })
          setDistricts(districts)
          
          // 동읍면 데이터 설정
          const neighborhoods: Region[] = []
          Array.from(neighborhoodsSet).forEach(neighborhood => {
            const parts = neighborhood.split(' ')
            if (parts.length >= 3) {
              const sido = parts[0]
              const sgg = parts[1]
              const umd = parts[2]
              
              neighborhoods.push({
                code: neighborhood, // 전체 경로를 code로 사용하여 고유성 보장
                name: umd,
                parentCode: `${sido} ${sgg}` // 시도 + 시군구를 parentCode로 사용
              })
            }
          })
          setNeighborhoods(neighborhoods)
          
        } catch (error) {
          console.error('전체 지역 데이터 로드 실패:', error)
          setError('전체 지역 데이터를 불러오는데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      } else {
        // 검색어가 없을 때는 기존 계층적 로직 사용
        // 시도 데이터만 로드하고 나머지는 선택에 따라 로드
        const loadCities = async () => {
          setLoading(true)
          setError(null)
          try {
            console.log('시/도 데이터 로드 시작')
            const data = await loadRegionsData()
            console.log('시/도 API 응답 데이터:', data)
            setCities(data)
          } catch (error) {
            console.error('시/도 데이터 로드 실패:', error)
            setError('시/도 데이터를 불러오는데 실패했습니다.')
          } finally {
            setLoading(false)
          }
        }
        
        loadCities()
        setDistricts([])
        setNeighborhoods([])
        setSelectedCity("")
        setSelectedDistrict("")
      }
    }

    loadAllRegionsForSearch()
  }, [searchTerm])

  // 검색어가 있을 때는 모든 결과를 표시, 없을 때는 계층적 표시
  const showAllResults = searchTerm.trim() !== ""

  // 지역 선택 핸들러
  const handleCitySelect = (cityCode: string) => {
    setSelectedCity(cityCode)
    setSelectedDistrict("")
  }

  const handleDistrictSelect = async (districtName: string, cityName: string) => {
    setSelectedDistrict(districtName)
    setSelectedCity(cityName) // 시도명도 함께 저장
    
    // 동읍면 데이터 로드
    try {
      // 시도명으로 파일명 찾기
      const sidoList = await loadSidoList()
      const selectedSido = sidoList.find(sido => sido.name === cityName)
      
      if (!selectedSido) {
        console.warn('시도를 찾을 수 없습니다:', cityName)
        return
      }
      
      const umdData = await loadUmdList(selectedSido.file, districtName)
      
      const neighborhoods = umdData.map(region => ({
        code: region.code,
        name: region.umdNm,
        parentCode: region.sggNm
      }))
      
      setNeighborhoods(neighborhoods)
    } catch (error) {
      console.error('동읍면 로드 실패:', error)
      setNeighborhoods([])
    }
  }

  const handleNeighborhoodToggle = (neighborhoodCode: string, neighborhoodName: string) => {
    const cityName = cities.find(r => r.code === selectedCity)?.name || ""
    const districtName = selectedDistrict // 이미 시군구명이 저장됨
    const regionName = `${cityName} ${districtName} ${neighborhoodName}`
    
    if (selectedRegions.includes(regionName)) {
      onRegionsChange(selectedRegions.filter(region => region !== regionName))
    } else {
      onRegionsChange([...selectedRegions, regionName])
    }
  }

  // 지역 제거 핸들러
  const handleRemoveRegion = (regionToRemove: string) => {
    onRegionsChange(selectedRegions.filter(region => region !== regionToRemove))
  }

  // 초기화 핸들러
  const handleReset = () => {
    setSelectedCity("")
    setSelectedDistrict("")
    setSearchTerm("")
    onRegionsChange([])
  }

  // 검색 실행
  const handleSearch = () => {
    // 검색 로직 (필요시 구현)
    console.log("지역 검색:", searchTerm)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* 검색 입력 및 옵션 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setIsOpen(true)}
            className="pr-10 bg-white"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* 지역 선택 영역 */}
      {isOpen && (
        <Card className="border border-gray-200 pt-0 overflow-hidden shadow-none">
        <CardContent className="p-0">
          <div className="flex h-80">
            {/* 시/도 컬럼 */}
            <div className="flex-1 border-r border-gray-200">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">시·도</h3>
              </div>
                <ScrollArea className="h-72">
                  <div className="p-2 space-y-1">
                    {loading || isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">로딩 중...</span>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-red-500 text-sm mb-2">⚠️ 에러 발생</div>
                        <div className="text-xs text-gray-500 mb-2">{error}</div>
                        <div className="text-xs text-gray-400">
                          개발자 도구 콘솔을 확인하세요
                        </div>
                      </div>
                    ) : cities.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="text-gray-500 text-sm mb-2">📭 데이터 없음</div>
                        <div className="text-xs text-gray-400">
                          API 응답이 비어있습니다
                        </div>
                      </div>
                    ) : (
                      cities.map((city) => (
                        <button
                          key={city.code}
                          onClick={() => handleCitySelect(city.code)}
                            className={cn(
                              "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                              selectedCity === city.code && "bg-primary/10 text-primary"
                            )}
                        >
                          {city.name}
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
            </div>

            {/* 시/구/군 컬럼 */}
            <div className="flex-1 border-r border-gray-200">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">시·구·군</h3>
              </div>
                <ScrollArea className="h-72">
                  <div className="p-2 space-y-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {selectedCity && (
                          <button
                            onClick={() => {
                              setSelectedDistrict("")
                              const cityName = cities.find(r => r.code === selectedCity)?.name
                              const regionName = cityName || "" // "전체" 대신 실제 시도명 사용
                              
                              if (selectedRegions.includes(regionName)) {
                                onRegionsChange(selectedRegions.filter(region => region !== regionName))
                              } else {
                                onRegionsChange([...selectedRegions, regionName])
                              }
                            }}
                            className={cn(
                              "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                              selectedRegions.includes(cities.find(r => r.code === selectedCity)?.name || "") && "bg-primary/10 text-primary"
                            )}
                          >
                            {cities.find(r => r.code === selectedCity)?.name} 전체
                          </button>
                        )}
                        {districts.map((district) => (
                          <button
                            key={district.code}
                            onClick={() => handleDistrictSelect(district.name, district.parentCode || "")}
                            className={cn(
                              "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                              selectedDistrict === district.name && "bg-primary/10 text-primary"
                            )}
                          >
                            {district.name}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </ScrollArea>
            </div>

            {/* 동/읍/면 컬럼 */}
            <div className="flex-1">
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">동·읍·면</h3>
              </div>
                <ScrollArea className="h-72">
                  <div className="p-2 space-y-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {(selectedDistrict || showAllResults) && (
                          <button
                            onClick={() => {
                              const districtName = districts.find(r => r.code === selectedDistrict)?.name
                              const cityName = cities.find(r => r.code === selectedCity)?.name
                              const regionName = `${cityName} ${districtName}` // "전체" 제거하고 실제 지역명만 사용
                              
                              if (selectedRegions.includes(regionName)) {
                                onRegionsChange(selectedRegions.filter(region => region !== regionName))
                              } else {
                                onRegionsChange([...selectedRegions, regionName])
                              }
                            }}
                            className={cn(
                              "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2",
                              selectedRegions.some(region => region.includes(`${cities.find(r => r.code === selectedCity)?.name} ${districts.find(r => r.code === selectedDistrict)?.name}`)) && "bg-primary/10 text-primary"
                            )}
                          >
                            {cities.find(r => r.code === selectedCity)?.name} {districts.find(r => r.code === selectedDistrict)?.name} 전체
                            {selectedRegions.some(region => region.includes(`${cities.find(r => r.code === selectedCity)?.name} ${districts.find(r => r.code === selectedDistrict)?.name}`)) && (
                              <span className="text-primary">✓</span>
                            )}
                          </button>
                        )}
                        {(selectedDistrict || showAllResults) && neighborhoods.map((neighborhood) => {
                          const cityName = showAllResults ? neighborhood.parentCode?.split(' ')[0] || '' : cities.find(r => r.code === selectedCity)?.name
                          const districtName = showAllResults ? neighborhood.parentCode || '' : selectedDistrict
                          const regionName = `${cityName} ${districtName} ${neighborhood.name}`
                          const isSelected = selectedRegions.includes(regionName)
                          
                          return (
                            <button
                              key={neighborhood.code}
                              onClick={() => handleNeighborhoodToggle(neighborhood.code, neighborhood.name)}
                              className={cn(
                                "w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2",
                                isSelected && "bg-primary/10 text-primary"
                              )}
                            >
                              {neighborhood.name}
                              {isSelected && (
                                <span className="text-primary">✓</span>
                              )}
                            </button>
                          )
                        })}
                      </>
                    )}
                  </div>
                </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
      )}

      {/* 선택된 지역 표시 */}
      {selectedRegions.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {selectedRegions.map((region) => (
            <Badge
              key={region}
              variant="secondary"
              className="bg-gray-700 text-gray-100 hover:bg-gray-600 px-3 py-1"
            >
              {region.split(' ').pop()}
              <button
                onClick={() => handleRemoveRegion(region)}
                className="ml-2 hover:text-gray-300"
              >
                ×
              </button>
            </Badge>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            초기화
          </Button>
        </div>
      )}
    </div>
  )
}
