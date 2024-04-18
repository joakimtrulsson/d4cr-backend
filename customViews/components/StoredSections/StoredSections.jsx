import React from 'react';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Tooltip } from '@keystone-ui/tooltip';
import { Button } from '@keystone-ui/button';
import { MinusCircleIcon, EditIcon, MoveIcon } from '@keystone-ui/icons';

import { styles } from '../../styles.js';

function StoredSections({
  sectionsData,
  onEditSection,
  onDelete,
  onChange,
  setSectionsData,
  activeSection,
}) {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sectionsCopy = [...sectionsData];
    const [removed] = sectionsCopy.splice(result.source.index, 1);
    sectionsCopy.splice(result.destination.index, 0, removed);

    setSectionsData(sectionsCopy);
    onChange(JSON.stringify(sectionsCopy));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='sections'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              paddingLeft: '0',
              paddingTop: '1rem',
              borderTop: '1px solid #e1e5e9',
            }}
          >
            {sectionsData.map((section, index) => (
              <Draggable key={section.id} draggableId={section.id} index={index}>
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={styles.list.li}
                  >
                    <div className={styles.list.data}>
                      <div>
                        {index + 1}.
                        {section.sectionType === 'CHAPTERTEASER'
                          ? ' Chapter Teaser'
                          : section.sectionType === 'STEERINGGROUP'
                          ? 'Steering Group'
                          : ` ${section.sectionType} - ${
                              section.sectionTitle && section.sectionTitle
                            }${
                              section.sectionType === 'MEDIATEXT'
                                ? ` Border: ${section.border}`
                                : ''
                            }`}
                      </div>
                    </div>

                    {onChange && (
                      <div style={{ display: 'flex' }}>
                        <div
                          {...provided.dragHandleProps}
                          className={styles.list.optionButton}
                          style={{
                            cursor: 'grab',
                            backgroundColor: '#eff3f6',
                            borderRadius: '5px',
                            width: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <MoveIcon
                            className={styles.list.optionButton}
                            style={{
                              color: 'grey',
                              marginRight: '0.3rem',
                            }}
                          />
                        </div>
                        <Tooltip content='Edit section' weight='subtle' placement='top'>
                          {(tooltipProps) => (
                            <div {...tooltipProps}>
                              <Button
                                size='small'
                                className={styles.list.optionButton}
                                onClick={() => onEditSection(section.id)}
                              >
                                <EditIcon size='small' color='blue' />
                              </Button>
                            </div>
                          )}
                        </Tooltip>
                        {/* <Button
                          onClick={() => onDelete(section.id)}
                          size='small'
                          className={styles.list.optionButton}
                          disabled={activeSection !== 'Select'}
                          tone='negative'
                        >
                          <MinusCircleIcon size='small' color='red' />
                        </Button> */}
                        <Tooltip
                          content='Delete is disabled when a section is open'
                          weight='subtle'
                          placement='top'
                        >
                          {(tooltipProps) => (
                            <div {...tooltipProps}>
                              <Button
                                onClick={() => onDelete(section.id, section.sectionTitle)}
                                size='small'
                                className={styles.list.optionButton}
                                disabled={activeSection !== 'Select'}
                                tone='negative'
                              >
                                <MinusCircleIcon size='small' color='red' />
                              </Button>
                            </div>
                          )}
                        </Tooltip>
                      </div>
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default StoredSections;
