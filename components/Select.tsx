import React,{Fragment} from 'react';
import { Listbox,Transition } from '@headlessui/react';
import { SelectorIcon,CheckIcon } from '@heroicons/react/outline';

type Props = {
  value:any
  setValue:any
  list:any
}

function Select({value,setValue,list}:Props) {
  // Value -> { name , id , value}
  return (
  <Listbox value={value} onChange={setValue}>
    <div className="relative">
      <Listbox.Button className="relative font-normal font-body w-full py-2 pl-4 pr-10 text-left active:scale-[98%] bg-slate-800 active:bg-slate-900 ring-1 ring-slate-500  active:bg-opacity-50 bg-opacity-50 rounded-xl cursor-pointer focus:ring-violet-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75  focus-visible:ring-violet-500">
        <span className="block truncate">{value.name}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon
            className="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
        as="div"

        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute w-full z-10 py-2 mt-2 overflow-auto text-base bg-slate-800 bg-opacity-50 backdrop-blur-xl rounded-xl shadow-lg max-h-60 ring-1 ring-slate-400 ring-opacity-50 focus:outline-none sm:text-sm">
          {list.map((item) => (
            <Listbox.Option
              key={item.id}
              className={({ active }) =>
                `${active ? 'text-violet-400' : 'text-slate-violet'}
                  cursor-default font-body select-none hover:bg-slate-900 relative py-2 pl-10 pr-4`
              }
              value={item}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={`${selected ? 'font-medium text-violet-400' : 'font-normal'
                      } block truncate`}
                  >
                    {item.name}
                  </span>
                  {selected ? (
                    <span
                      className={`${active ? 'text-violet-500' : 'text-violet-500'
                        }
                        absolute inset-y-0 left-0 flex items-center pl-3`}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
  );
}

export default Select;