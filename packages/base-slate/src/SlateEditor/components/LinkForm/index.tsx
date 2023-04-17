import { FC, useState } from 'react'
import { TbLink } from 'react-icons/tb'
import { BiText } from 'react-icons/bi'
import Button from '../Button'

type LinkState = {
  text: string
  url: string
}

export type LinkFormProps = {
  node: LinkState
  onSubmit?: (link: LinkState) => void
}

const LinkForm: FC<LinkFormProps> = ({ node, onSubmit = () => {} }) => {
  const [link, setLink] = useState<LinkState>(() => ({ text: node.text, url: node.url }))

  return (
    <div>
      <div className='flex border-slate-200 items-center pb-1 gap-x-1.5' style={{ borderBottomWidth: 1 }}>
        <TbLink className='text-gray-400 text-sm' />
        <input
          value={link.text}
          onChange={e => {
            setLink(state => ({
              ...state,
              text: e.target.value
            }))
          }}
          className='border-none outline-none'
        />
      </div>
      <div className='flex items-center pt-1 gap-x-1.5 pb-1 border-slate-200' style={{ borderBottomWidth: 1 }}>
        <BiText className='text-gray-400 text-sm' />
        <input
          value={link.url}
          onChange={e => {
            setLink(state => ({
              ...state,
              url: e.target.value
            }))
          }}
          className='border-none outline-none'
        />
      </div>
      <div className='flex justify-end mt-1'>
        <Button isActive className='text-sm' onClick={() => onSubmit(link)}>确定</Button>
      </div>
    </div>
  )
}

export default LinkForm
