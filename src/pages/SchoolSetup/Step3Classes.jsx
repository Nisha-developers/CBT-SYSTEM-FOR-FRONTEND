import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../store/useSchoolStore';
import Button from '../../components/common/Button';
import Steps from '../../components/common/Steps';

export default function Step3Classes() {
  const navigate = useNavigate();
  const { wizard, setWizardStep } = useSchoolStore();
  const [input, setInput] = useState('');

  const [editingClass, setEditingClass] = useState(null);

  const addClass = () => {
    if (!input.trim()) return;
  if(isDuplicate(input.trim(), wizard.classes)) return;
    setWizardStep('classes', [...wizard.classes, input.trim()]);
    setInput('');
  };

  const editClass = (name) => {
    setEditingClass(name);
    setInput(name);
  };

  const updateClass = () => {
    if (!input.trim()) return;
    if(isDuplicate(input.trim(), wizard.classes)) return;

    setWizardStep(
      'classes',
      wizard.classes.map((c) =>
        c === editingClass ? input.trim() : c
      )
    );

    setEditingClass(null);
    setInput('');
  };
const isDuplicate = (value, list) => {
  return list.some(
    (item) => item.toLowerCase() === value.trim().toLowerCase()
  );
};
  const removeClass = (name) =>
    setWizardStep(
      'classes',
      wizard.classes.filter((c) => c !== name)
    );

  return (
    <div className="min-h-screen flex items-center flex-col bg-gray-50 mt-14">

      <Steps
        activeStep={3}
        textContent="Classes(Eg: JSS1, SS2)"
      />

      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">

        <Button
          className="mb-8"
          onClick={() => navigate('/school-setup/info2')}
        >
          Prev
        </Button>

        <div className="flex gap-2 mb-4">

          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. SS1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              (editingClass !== null
                ? updateClass()
                : addClass())
            }
          />

          {editingClass !== null ? (
            <Button onClick={updateClass}>
              Update
            </Button>
          ) : (
            <Button variant="outline" onClick={addClass}>
              Add
            </Button>
          )}

        </div>

        <ul className="mb-6 space-y-1">

          {wizard.classes.map((c) => (
            <li
              key={c}
              className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded"
            >

              <span>{c}</span>

              <div className="flex gap-2">

                {/* Edit */}
                <Button
                  variant="process"
                  className="p-2 flex items-center justify-center"
                  onClick={() => editClass(c)}
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24.00 24.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C21.8083 3.21243 21.6147 2.91833 21.3686 2.67153C21.1225 2.42473 20.8289 2.23033 20.5056 2.10012C20.1823 1.96991 19.8359 1.90657 19.4875 1.9139C19.139 1.92124 18.7956 1.99914 18.4781 2.14284C18.1605 2.28654 17.8754 2.49308 17.6399 2.75002L8.08987 12.3C7.13987 13.25 6.70987 16.07 7.33987 16.7C7.96987 17.33 10.7899 16.89 11.7399 15.94L21.2799 6.40005Z"
                      stroke="#fff"
                      strokeWidth="1.624"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                      stroke="#fff"
                      strokeWidth="1.624"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

                {/* Delete */}
                <Button
                  variant="danger"
                  className="p-2 flex items-center justify-center"
                  onClick={() => removeClass(c)}
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 7H20"
                      stroke="#fff"
                      strokeWidth="1.768"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10"
                      stroke="#fff"
                      strokeWidth="1.768"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                      stroke="#fff"
                      strokeWidth="0.768"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>

              </div>

            </li>
          ))}

        </ul>

        <div className="flex justify-end">

          <Button
            className=""
            onClick={() => navigate('/school-setup/arms')}
          >
            Next
          </Button>

        </div>

      </div>
    </div>
  );
}


