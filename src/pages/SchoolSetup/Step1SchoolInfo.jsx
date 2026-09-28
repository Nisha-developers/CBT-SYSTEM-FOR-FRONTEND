import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';
import { useEffect } from 'react';



export default function Step1SchoolInfo({fields}) {
  
  const navigate = useNavigate();
 const determinPath = fields.includes('phone') ? '/school-setup/info2' : '/school-setup/classes';

 console.log(determinPath);
  const { wizard, setWizardStep } = useSchoolStore();
  const info = wizard.info;

  return (
    <div className="min-h-screen bg-gray-50">
      
        {/* <p className="text-sm text-gray-500 mb-6">Step 1 of 4School Information</p> */}
       
        <Steps activeStep={determinPath.includes('info2') ? 1 : 2}  textContent = 'School Information'/>
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mx-auto mt-14">
        {
         !(determinPath.includes('info2')) && (
            <Button className="mb-4" onClick={() => navigate('/school-setup/info')}>
              Prev
            </Button>
          )
        }
       

        {fields.map((field) => (
          field !== 'Logo' && field !== 'Description' && (
             <form key={field} className="mb-4">
            <label className="block text-sm mb-1 capitalize">{field}</label>
            
            <input
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={info[field] || ''}
              onChange={(e) => setWizardStep('info', { ...info, [field]: e.target.value })}
           required />
           
          </form>
          )
        ))}
        {/* Logo upload */}
{fields.includes('Logo') && (
  <div className="mb-4">
    <label className="block text-sm mb-1">
      Logo
    </label>

    <input
      type="file"
      accept="image/*"
      className="w-full border rounded-md px-3 py-2 text-sm"
      onChange={(e) => {
        const file = e.target.files[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (event) => {
            setWizardStep('info', {
              ...info,
              logoUrl: event.target.result
            });
          };

          reader.readAsDataURL(file);
        }
      }}
    />

    {/* Preview */}
    {info.logoUrl && (
      <img
        src={info.logoUrl}
        alt="School logo"
        className="w-20 h-20 object-contain mt-3"
      />
    )}
  </div>
)}

{fields.includes('Description') && (
  <form className="mb-4">
    <label className="block text-sm mb-1 capitalize">Description</label>
    <textarea
      className="w-full border rounded-md px-3 py-2 text-sm"
      value={info.description || ''}
      onChange={(e) => setWizardStep('info', { ...info, description: e.target.value })}
  required  />
  </form>
)}
        {/* Logo upload wiring goes here — store the file/URL in wizard.info.logoUrl */}
<div className="flex justify-end">
        <Button className="" onClick={() => navigate(determinPath)} formAction = {true}>
          Next
        </Button>
        </div>
      </div>
    </div>
  );
}
