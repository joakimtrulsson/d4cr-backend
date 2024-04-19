import React, { useState } from 'react';

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Tooltip } from '@keystone-ui/tooltip';
import { Button } from '@keystone-ui/button';
import { MinusCircleIcon, EditIcon, MoveIcon, EyeIcon } from '@keystone-ui/icons';
import Modal from 'react-modal';

import BannerPreview from '../../sections/previews/BannerPreview.jsx';
import LargeBulletListPreview from '../../sections/previews/LargeBulletListPreview.jsx';
import AccordionPreview from '../../sections/previews/AccordionPreview.jsx';
import MediaTextPreview from '../../sections/previews/MediaTextPreview.jsx';
import NewsTeaserPreview from '../../sections/previews/NewsTeaserPreview.jsx';
import ImagePreview from '../../sections/previews/ImagesPreview.jsx';
import PrinciplesPreview from '../../sections/previews/PrinciplesPreview.jsx';
import WyiswygPreview from '../../sections/previews/WysiwygPreview.jsx';
import ChapterTeaserPreview from '../../sections/previews/ChapterTeaserPreview.jsx';

import { styles } from '../../styles.js';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    // marginRight: '-30%',
    transform: 'translate(-50%, -50%)',
    border: 'none',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    width: '80%',
  },
};

const sectionComponents = {
  ACCORDION: AccordionPreview,
  BANNER: BannerPreview,
  BULLETLIST: LargeBulletListPreview,
  CHAPTERTEASER: ChapterTeaserPreview,
  IMAGE: ImagePreview,
  MEDIATEXT: MediaTextPreview,
  NEWSTEASER: NewsTeaserPreview,
  PRINCIPLES: PrinciplesPreview,
  WYSIWYG: WyiswygPreview,
};

function StoredSections({
  sectionsData,
  onEditSection,
  onDelete,
  onChange,
  setSectionsData,
  activeSection,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const openModal = (id) => {
    setActiveId(id);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sectionsCopy = [...sectionsData];
    const [removed] = sectionsCopy.splice(result.source.index, 1);
    sectionsCopy.splice(result.destination.index, 0, removed);

    setSectionsData(sectionsCopy);
    onChange(JSON.stringify(sectionsCopy));
  };

  const activeSectionPreview = sectionsData.find((section) => section.id === activeId);
  const SectionComponent = sectionComponents[activeSectionPreview?.sectionType];

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
                          ? ' Steering Group'
                          : ` ${section.sectionType} - ${
                              section.sectionTitle && section.sectionTitle
                            }${
                              section.sectionType === 'MEDIATEXT'
                                ? (() => {
                                    switch (section.border) {
                                      case 'TOPBOTTOM':
                                        return ' Border: Top & Bottom';
                                      case 'TOP':
                                        return ' Border: Top';
                                      case 'BOTTOM':
                                        return ' Border: Bottom';
                                      default:
                                        return '';
                                    }
                                  })()
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
                        <Tooltip
                          content='Edit this section'
                          weight='subtle'
                          placement='top'
                        >
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

                        <Tooltip
                          content='Live preview of this section'
                          weight='subtle'
                          placement='top'
                        >
                          {(tooltipProps) => (
                            <div {...tooltipProps}>
                              <Button
                                size='small'
                                className={styles.list.optionButton}
                                onClick={() => openModal(section.id)}
                              >
                                <EyeIcon size='small' color='blue' />
                              </Button>
                            </div>
                          )}
                        </Tooltip>

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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Preview section'
        ariaHideApp={false}
        style={customStyles}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {SectionComponent && (
            <SectionComponent
              key={activeSectionPreview.id}
              content={activeSectionPreview}
            />
          )}
          <Button style={{ marginTop: '1rem' }} onClick={closeModal}>
            Close
          </Button>
        </div>
      </Modal>
    </DragDropContext>
  );
}

export default StoredSections;
