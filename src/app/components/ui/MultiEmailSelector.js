import React from 'react';
import { ReactMultiEmail } from 'react-multi-email';
import "react-multi-email/dist/style.css";

const MultiEmailSelector = ({emailsListError, emailsList, label, setEmailsList }) => (
    <>
      <label className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <div className="block w-full rounded-md border border-gray-400 shadow-sm focus-within:border-indigo-300 focus-within:ring focus-within:ring-indigo-200 focus-within:ring-opacity-50">
            <ReactMultiEmail
                placeholder="Enter Emails here"
                emails={emailsList}
                onChange={(_emails) => setEmailsList(_emails)}
                getLabel={(email, index, removeEmail) => {
                    return (
                        <div data-tag key={index}>
                            {email}
                            <span data-tag-handle onClick={() => removeEmail(index)}>
                                ×
                            </span>
                        </div>
                    );
                }}
            />
        </div>
        {emailsListError && <p className="text-red-500 text-sm">{emailsListError}</p>}
    </>
);
export default MultiEmailSelector;