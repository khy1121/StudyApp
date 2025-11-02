import React from 'react'
import SelectPage from '../../components/SelectCourse/selectPage'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStart = (payload) => {
    console.log('학습 시작:', payload);
    // TODO: 선택한 설정으로 학습 페이지로 이동
    // navigate('/home', { state: payload });
  };

  return (
    <SelectPage onStart={handleStart} />
  )
}
