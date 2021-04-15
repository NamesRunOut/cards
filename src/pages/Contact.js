import React from 'react'

import {Form, Formik, useField} from 'formik';
import * as Yup from 'yup';

import {Link} from 'react-router-dom'

const Emailinput = ({label, ...props}) => {
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="form_error">{meta.error}</div>
            ) : null}
        </>
    )
}

const Titleinput = ({label, ...props}) => {
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="form_error">{meta.error}</div>
            ) : null}
        </>
    )
}

const Textinput = ({label, ...props}) => {
    const [field, meta] = useField(props)

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="form_error">{meta.error}</div>
            ) : null}
        </>
    )
}

const Contact = () => {

    return (
        <>
            <Link to="/">
                <button className="form_back">Back</button>
            </Link>
            <Formik
                initialValues={{
                    email: '',
                    title: '',
                    message: ''
                }}

                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .nullable('Value is empty'),
                    title: Yup.string()
                        .min(3, "The title must have at least 3 characters")
                        .max(35, "The title is too long")
                        .nullable('Value is empty'),
                    message: Yup.string()
                        .min(3, "Must have at least 3 characters")
                        .max(500, "The message cant be longer than 500 characters")
                        .nullable('Value is empty'),
                })
                }

                onSubmit={(values, {setSubmitting, resetForm}) => {
                    const body = {
                        sender: values.email,
                        title: values.title,
                        message: values.message
                    }

                    fetch('https://mysterious-caverns-api.herokuapp.com/mailboxes', {
                        method: 'post',
                        body: JSON.stringify(body),
                        headers: {'Content-Type': 'application/json'}
                    })
                        .then(setSubmitting(false))
                        .then(resetForm())
                        .then(alert("Message successfully submitted!"))
                }
                }
            >

                {props => (
                    <div className="wrapper_form">
                        <Form className="form">
                            <h1>Contact form</h1>
                            <Emailinput className="form_input" label="Your email" name="email" type="email"
                                        placeholder="your@email.com"/>
                            <Titleinput className="form_input" label="Title" name="title" type="text"
                                        placeholder="Your title"/>
                            <Textinput className="form_input--textarea" label="Message" name="message"
                                       placeholder="Write something here!"/>
                            <button className="form_submit"
                                    type="submit">{props.isSubmitting ? 'Sending message...' : 'Submit'}</button>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    )
}

export default Contact