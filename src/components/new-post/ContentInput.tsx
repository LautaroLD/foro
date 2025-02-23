/* eslint-disable react-hooks/exhaustive-deps */
import { Editor } from 'primereact/editor'
import { Galleria } from 'primereact/galleria'
import { Image } from 'primereact/image'
import { SelectButton } from 'primereact/selectbutton'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BiCloudUpload, BiXCircle } from 'react-icons/bi'

export default function ContentInput() {
  const { setValue, getValues } = useFormContext()
  const [content, setContent] = useState('')

  const [type, setType] = useState<'image' | 'text'>('image')
  const [files, setFiles] = useState<{ type: string; src: string }[]>([])
  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }
  useEffect(() => {
    setValue('content', content)
  }, [content])
  useEffect(() => {
    setValue('typeContent', type)
  }, [type])

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-5 items-center'>
        <b className='text-xl'>Contenido</b>
        <SelectButton
          value={type}
          onChange={(e) => setType(e.value)}
          options={[
            { value: 'text', label: 'Texto' },
            { value: 'image', label: 'Imagen' },
          ]}
        />
      </div>
      {type === 'image' && (
        <div className='flex flex-col w-full h-fit items-center justify-center gap-4'>
          <div className='border rounded-lg px-4 flex items-center justify-center border-slate-600 hover:bg-white hover:text-black relative '>
            <p>Selecciona las imágenes que deseas subir </p>
            <BiCloudUpload size={60} className='ml-3' />
            <input
              className='absolute opacity-0 inset-0 cursor-pointer'
              type='file'
              multiple
              onChange={(e) => {
                if (e.target.files?.length) {
                  ;[...e.target.files].forEach((file) => {
                    setValue('files', [...(getValues('files') ?? []), file])
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = (e) => {
                      setFiles((prev) => [
                        ...prev,
                        {
                          type: file.type,
                          src: e.target?.result as string,
                        },
                      ])
                    }
                  })
                }
              }}
            />
          </div>
          {files.length > 0 && (
            <Galleria
              value={files}
              numVisible={5}
              circular
              showItemNavigators
              showItemNavigatorsOnHover
              showIndicators
              showThumbnails={false}
              item={(item) => {
                return (
                  <div className='w-full h-full max-w-md'>
                    <div className='absolute w-full flex justify-end bg-black bg-opacity-50 p-3'>
                      <BiXCircle
                        size={35}
                        className='cursor-pointer'
                        onClick={() =>
                          removeImage(files.findIndex((f) => f === item))
                        }
                      />
                    </div>
                    {item.type.includes('image') ? (
                      <Image
                        preview
                        src={item.src}
                        alt={files.findIndex((f) => f === item).toString()}
                        // className='object-cover rounded-lg'
                        style={{ borderRadius: '10px', overflow: 'hidden' }}
                      />
                    ) : (
                      <video src={item.src} controls />
                    )}
                  </div>
                )
              }}
            />
          )}
        </div>
      )}
      {type == 'text' && (
        <Editor
          value={content}
          onTextChange={(val) => setContent(val.htmlValue || '')}
          style={{
            height: 350,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            overflow: 'hidden',
            padding: 2,
            border: '1px solid #64748b ',
          }}
        />
      )}
    </div>
  )
}
