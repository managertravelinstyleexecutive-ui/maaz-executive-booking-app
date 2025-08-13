import * as React from "react";
export function Label(props: React.HTMLProps<HTMLLabelElement>){ return <label {...props} className={"block mb-1 text-sm font-medium "+(props.className||"")} /> }
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({className,...p},r)=>(<input ref={r} {...p} className={"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 "+(className||"")} />)); Input.displayName="Input";
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){ return <textarea {...props} className={"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 "+(props.className||"")} /> }
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>){ return <button {...props} className={"rounded-2xl px-4 py-2 text-sm bg-black text-white hover:opacity-90 disabled:opacity-40 "+(props.className||"")} /> }
