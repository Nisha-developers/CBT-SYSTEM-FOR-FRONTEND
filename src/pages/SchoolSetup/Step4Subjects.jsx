import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import { setupSchool as setupSchoolApi } from '../../api/school.api';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

export default function Step4Subjects() {
  const navigate = useNavigate();
  const { wizard, setWizardStep, setSchool, resetWizard } = useSchoolStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeClass, setActiveClass] = useState(0);
  const [selectedArms, setSelectedArms] = useState(null);


console.log(wizard);

  const addSubject = () => {
  if (!input.trim() || !selectedClass || !selectedArms) return;

  const existing = wizard.subjects.find(
    (item) =>
      item.className === selectedClass &&
      item.armName === selectedArms
  );

  if (existing) {
    const updatedSubjects = wizard.subjects.map((item) =>
      item.className === selectedClass &&
      item.armName === selectedArms
        ? {
            ...item,
            offerSubject: [...item.offerSubject, input.trim()]
          }
        : item
    );

    setWizardStep('subjects', updatedSubjects);
  } else {
    setWizardStep('subjects', [
      ...wizard.subjects,
      {
        className: selectedClass,
        armName: selectedArms,
        offerSubject: [input.trim()]
      }
    ]);
  }

  setInput('');
};
  const handleClassClick = (cls) =>{
    setSelectedClass(cls);
   const activeClass =  wizard.arms.findIndex((index) => index.className.includes(cls)); 
    setActiveClass(activeClass); 
    
  }

  const finishSetup = async () => {
    setSaving(true);
    setError('');
    // try {
    //   const { data } = await setupSchoolApi({
    //     ...wizard.info,
    //     classes: wizard.classes,
    //     arms: wizard.arms,
    //     subjects: wizard.subjects,
    //   });
    //   setSchool(data.school);
    //   
    //   ;
    // } catch (err) {
    //   console.log(err.response?.data?.message);
    //   setError(err.response?.data?.message || 'Setup failed');
    // } finally {
    //   setSaving(false);
    // }
      localStorage.setItem('setupSchoolApi', JSON.stringify({
         ...wizard.info,
         classes: wizard.classes,
         arms: wizard.arms,
        subjects: wizard.subjects,
      }))
      resetWizard();
      navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center flex-col bg-gray-50 ">
     <Steps activeStep={5} textContent = 'Subjects (e.g. Mathematics, English)' />
       
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mt-14">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
<Button className="mb-8" onClick={() => navigate('/school-setup/arms')}>
          Prev
        </Button>
        <div className="flex gap-2 mb-4 flex-wrap cursor-pointer">
         {wizard.classes.length > 0 &&(
          wizard.classes.map((cls) => (
            <div key={cls} className="bg-blue-100  text-blue-800 px-2 py-1 rounded text-sm" onClick = {() => handleClassClick(cls)}>
              {cls}
            </div>
          ))
         )}
         </div>
         <div>
          {wizard?.arms?.length > 0 && <select onChange={(e)=> setSelectedArms(e.target.value)} className="border rounded-md px-3 py-2 text-sm w-full mb-4">
            <option value={selectedClass}>{selectedClass || 'Select Class'}</option>
            {wizard?.arms[activeClass]?.armNames.map((arms)=>(
              <option key={arms}>{arms}</option>
            ))}
          </select> }
         </div>
         {/* Add subject Begins  */}
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. Mathematics"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSubject()}
          />
          <Button variant="outline" onClick={addSubject}>Add</Button>
        </div>
{/* Add subject Ends */}

  {wizard.subjects.map((item)=>
    <div>
<div className='flex gap-x-2 mb-2'>
  <h2 className='font-bold'>{item?.className || selectedClass}</h2>
  <h2 className='font-bold'>{item?.armName || selectedArms}</h2>
  </div>
     <ul className="mb-6 space-y-1 text-sm">
      {item?.offerSubject.length > 0 && item?.offerSubject.map((s)=><li key={s} className="bg-gray-50 px-3 py-2 rounded">{s}</li>) }
     </ul>
    </div>
  )}
     
          
          

       

        <Button className="w-full" onClick={finishSetup} disabled={saving}>
          {saving ? 'Setting up...' : 'Finish Setup'}
        </Button>
      </div>
    </div>
  );
}
