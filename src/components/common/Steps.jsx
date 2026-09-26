const Steps = ({ activeStep, textContent }) => {
    const handleStepClick = (step) => {
      if(activeStep === step) return; 
       
    }
  return (
    <>
      <h1 className="text-xl font-extrabold mb-9 pt-10 text-blue-600 text-center">School Setup</h1>
    <ul className="flex justify-center space-x-4 mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <li
          key={step}
          className={`relative z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white ${
            step > 1
              ? "before:absolute before:right-full before:top-1/2 before:h-1 before:w-4 before:-translate-y-1/2 before:bg-black before:content-['']"
              : ''
          } ${activeStep === step ? 'bg-blue-900' : 'bg-blue-600'}`}
          onClick={() => handleStepClick(step)}
        >
          {step}
        </li>
      ))}
    </ul>
     <p className="text-sm text-gray-500 mb-6 text-center">{textContent}</p>
    </>
  )
}

export default Steps
