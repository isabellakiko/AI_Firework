import type { FC } from 'react'
import {
  memo,
  useRef,
} from 'react'
import { useHover } from 'ahooks'
import type { ConversationItem } from '@/models/share'
import Operation from '@/app/components/base/chat/chat-with-history/sidebar/operation'
import cn from '@/utils/classnames'

type ItemProps = {
  isPin?: boolean
  item: ConversationItem
  onOperate: (type: string, item: ConversationItem) => void
  onChangeConversation: (conversationId: string) => void
  currentConversationId: string
}
const Item: FC<ItemProps> = ({
  isPin,
  item,
  onOperate,
  onChangeConversation,
  currentConversationId,
}) => {
  const ref = useRef(null)
  const isHovering = useHover(ref)
  const isSelected = currentConversationId === item.id

  return (
    <div
      ref={ref}
      key={item.id}
      className={cn(
        'system-sm-medium group flex cursor-pointer rounded-lg p-1 pl-3 hover:bg-state-base-hover',
      )}
      style={{
        color: isSelected ? '#f2c823' : '#e0e0e0',
        backgroundColor: isSelected ? 'rgba(242, 200, 35, 0.15)' : 'transparent',
      }}
      onClick={() => onChangeConversation(item.id)}
    >
      <div className='grow truncate p-1 pl-0' title={item.name}>{item.name}</div>
      {item.id !== '' && (
        <div className='shrink-0' onClick={e => e.stopPropagation()}>
          <Operation
            isActive={isSelected}
            isPinned={!!isPin}
            isItemHovering={isHovering}
            togglePin={() => onOperate(isPin ? 'unpin' : 'pin', item)}
            isShowDelete
            isShowRenameConversation
            onRenameConversation={() => onOperate('rename', item)}
            onDelete={() => onOperate('delete', item)}
          />
        </div>
      )}
    </div>
  )
}

export default memo(Item)
