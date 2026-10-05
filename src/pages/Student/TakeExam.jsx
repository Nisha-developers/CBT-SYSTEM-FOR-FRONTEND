import React from 'react';
import ObjExam from './ObjExam';
import TheoryExam from './TheoryExam';

const TakeExam = () => {
  const Objexam = false;
  if(Objexam){
    return(
      <>
   <ObjExam />
    </>
    )
  }
  return (
    
    <div>
      <TheoryExam />
    </div>
  )
}

export default TakeExam
