"use client"
import React, { useState } from 'react'
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import BidForm from './BidFrom';

const AddBidRemind = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    return (
        <div className='mt-5'>
            <Button onClick={handleOpenModal} variant="primary" size="md">
                Add Bid Reminder
            </Button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} >
                <BidForm/>
            </Modal>
        </div>
    )
}

export default AddBidRemind