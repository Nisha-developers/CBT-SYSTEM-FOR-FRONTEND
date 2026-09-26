const Steps = ({ activeStep }) => {
  return (
    <ul className="flex justify-center space-x-4 mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <li
          key={step}
          className={`relative z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white ${
            step > 1
              ? "before:absolute before:right-full before:top-1/2 before:h-1 before:w-4 before:-translate-y-1/2 before:bg-black before:content-['']"
              : ''
          } ${activeStep === step ? 'bg-blue-900' : 'bg-blue-600'}`}
        >
          {step}
        </li>
      ))}
    </ul>
  )
}

export default Steps
