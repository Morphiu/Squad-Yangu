import React from 'react';

const Form = () => {
    return(
        <div>
            <h1>FORM</h1>
            <Form method="POST">
                <name> First Name</name>
                <input type="text" placeholder="Enter your first name"/>

                <name>Second Name</name>
                <input type="text" placeholder="Enter your second name"/>

                <name>Email </name>
                <input type="email" placeholder="Enter your email"/>

                <name>Phone Number</name>
                <input type="number" placeholder="Enter your phone number"/>

            </Form>
        </div>

    )
}

export default Form;
