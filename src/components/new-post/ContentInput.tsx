import { PostFile } from '@/models/file.model'
import { useMutation } from '@tanstack/react-query'
import { Carousel } from 'primereact/carousel'
import { Editor } from 'primereact/editor'
import { Image } from 'primereact/image'
import {
  SelectButton,
  SelectButtonPassThroughMethodOptions,
} from 'primereact/selectbutton'
import { classNames } from 'primereact/utils'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BiCloudUpload, BiXCircle } from 'react-icons/bi'
import { SiGooglegemini } from 'react-icons/si'
import Button from '../Button'
import api from '@/services/config'
import { toast } from 'react-toastify'

export default function ContentInput({
  contentInput,
  filesInput,
  typeContent,
  deletedFiles,
  setDeletedFiles,
}: {
  contentInput?: string
  filesInput?: PostFile[]
  typeContent?: 'image' | 'text'
  deletedFiles?: PostFile[]
  setDeletedFiles?: React.Dispatch<React.SetStateAction<PostFile[]>>
}) {
  const { setValue, getValues, watch } = useFormContext()
  const [content, setContent] = useState(contentInput || '')

  const [type, setType] = useState<'image' | 'text'>(typeContent || 'text')
  const [files, setFiles] = useState<{ type: string; src: string }[]>(
    filesInput || []
  )

  const getContentByAi = useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/gemini-content', {
        title: getValues('title'),
        categories: getValues('categories'),
        tags: getValues('tags'),
      })
      return res.data
    },
    onSuccess: (data) => {
      setContent(data)
    },
    onError: (error) => {
      console.error('Error generating content:', error)
      toast.error('No se pudo generar el contenido con IA')
    },
  })
  const removeImage = (item: PostFile) => {
    const index = files.findIndex((f) => f.src === item.src)
    if (deletedFiles && setDeletedFiles) {
      setDeletedFiles((prev) => [...prev, item])
    }
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
        <p className='text-xl font-semibold'>Contenido</p>
        {!typeContent && (
          <SelectButton
            unstyled
            value={type}
            className='flex'
            pt={{
              button: (options: SelectButtonPassThroughMethodOptions) => ({
                className: classNames(
                  'px-2 py-1',
                  options.context?.selected && 'bg-slate-700 rounded-lg'
                ),
              }),
            }}
            itemTemplate={(option) => <i className={option.icon}></i>}
            onChange={(e) => setType(e.value)}
            options={[
              { value: 'text', icon: 'pi pi-align-center' },
              { value: 'image', icon: 'pi pi-images' },
            ]}
          />
        )}
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
                  if (filesInput && filesInput.length > 0 && setDeletedFiles) {
                    setDeletedFiles(filesInput)
                    setFiles([])
                  }
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
            <Carousel
              value={files}
              numScroll={1}
              circular
              numVisible={1}
              itemTemplate={(item) => {
                return (
                  <div className=' h-[300px] w-full'>
                    <div className='absolute w-full flex justify-end bg-black bg-opacity-50 p-3  z-20'>
                      <BiXCircle
                        size={35}
                        className='cursor-pointer hover:text-red-500 transition-all duration-300'
                        onClick={() => removeImage(item)}
                      />
                    </div>
                    {item.type.includes('image') ? (
                      <Image
                        preview
                        src={item.src}
                        alt={files.findIndex((f) => f === item).toString()}
                        style={{ height: '100%', width: '100%' }}
                        imageStyle={{
                          height: '100%',
                          objectFit: 'contain',
                          margin: 'auto',
                        }}
                      />
                    ) : (
                      <video
                        src={item.src}
                        controls
                        className='h-full w-full  m-auto'
                      />
                    )}
                  </div>
                )
              }}
            />
          )}
        </div>
      )}
      {type == 'text' && (
        <>
          {getContentByAi.isError && (
            <p className='text-red-500'>Error al generar el contenido con IA</p>
          )}
          <div className='flex items-center gap-2 mb-2'>
            <p className='text-sm max-w-md text-gray-400'>
              Puedes generar el contenido con IA, debes agregar primero el
              titulo. <br /> Agrega categorías y etiquetas para obtener un
              resultado mas preciso{' '}
            </p>
            <Button
              disabled={watch('title') === ''}
              loading={getContentByAi.isPending}
              title='Debes agregar un titulo para generar el contenido con IA'
              type='button'
              size='sm'
              onClick={() => getContentByAi.mutate()}
            >
              <SiGooglegemini size={28} />
            </Button>
          </div>
          <Editor
            value={content}
            onTextChange={(val) => setContent(val.htmlValue || '')}
            style={{
              backgroundColor: '#000',
              height: 350,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              overflow: 'hidden',
              padding: 2,
              border: '1px solid #64748b ',
            }}
          />
        </>
      )}
    </div>
  )
}
