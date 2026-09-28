
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

  const handleNext = () => {

    for (const field of fields) {

      // if (field === 'Logo') {
      //   if (!info.logoUrl) return;
      //   continue;
      // }

      if (field === 'Description') {
        
        if (!info.description || !info.description.trim()) return;
        continue;
      }

      // if (!info[field] || !info[field].trim()) return;

      if (field.toLowerCase() === 'name') {
        console.log('HI2')
        if (/\d/.test(info[field])) return;
      }

      if (field.toLowerCase() === 'phone') {
        console.log('HI3')
        if (!/^\d+$/.test(info[field])) return;
      }
    }

    navigate(determinPath);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Steps
        activeStep={determinPath.includes('info2') ? 1 : 2}
        textContent="School Information"
      />

      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md mx-auto mt-14">

        {!(determinPath.includes('info2')) && (
          <Button
            className="mb-4"
            onClick={() => navigate('/school-setup/info')}
          >
            Prev
          </Button>
        )}

        {fields.map((field) => (
          field !== 'Logo' &&
          field !== 'Description' && (
            <form key={field} className="mb-4">

              <label className="block text-sm mb-1 capitalize">
                {field}
              </label>

              <input
                type={field.toLowerCase() === 'phone' ? 'tel' : 'text'}
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={info[field] || ''}
                onChange={(e) =>
                  setWizardStep('info', {
                    ...info,
                    [field]: e.target.value
                  })
                }
                required
              />

            </form>
          )
        ))}

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

            <label className="block text-sm mb-1 capitalize">
              Description
            </label>

            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={info.description || ''}
              onChange={(e) =>
                setWizardStep('info', {
                  ...info,
                  description: e.target.value
                })
              }
              required
            />

          </form>
        )}

        <div className="flex justify-end">

          <Button
            className=""
            onClick={handleNext}
            formAction={true}
          >
            Next
          </Button>

        </div>

      </div>
    </div>
  );
}

