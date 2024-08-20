// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Signup from "./components/Signup/Signup.jsx";
// import Emailverified from "./components/Emailverified/Emailverified.jsx";
// import Forgetpass from "./components/Forgetpassmail/Forgetpassmail.jsx";
// import Forgetpassmail from "./components/Forgetpassmail/Forgetpassmail.jsx";
// import Changepass from "./components/Changepass/Changepass.jsx";
// import Passchanged from "./components/Passchanged/Passchanged.jsx";
// import Verifyredirect from "./components/Verifyredirect/Verifyredirect.jsx";
// import Startupdetails from "./components/Startupdetails/Startupdetails.jsx";
// import Founder from "./components/Founders/Founder.jsx";
// import Addnewfounder from "./components/Founders/Addnewfounder/Addnewfounder_1/Addnewfounder.jsx";
// import Founderadded from "./components/Founders/Addnewfounder/Founderadded/Founderadded.jsx";
// import Foundersdata from "./components/Founders/Foundersdata/Foundersdata.jsx";
// import FounderDetails from "./components/Founderdetails/Founderdetails.jsx";
// import MisDocs from "./components/Misdocs/Misdocs.jsx";
// import Dashboard from "./components/Dashboard_1/Dash.jsx";
// import SuperadminDash from "./components/SuperAdmin/Superadmindash.jsx";
// import Admindashboard from "./components/Admin/Admindashboard.jsx";
// import Login from "./components/Signin/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute";
// import {
//   OrganizationList,
//   CreateOrganization,
//   EditOrganization,
//   OrganizationDetails,
// } from "./components/Organizations/Organizations";

// // PM1
// import Form from "./components/Form/Form.jsx";
// import FormDetails from "./components/Form/FormDetails.jsx";
// import FormBuilder from "./components/FormBuilder/FormBuilder.jsx";
// import FormPreview from "./components/FormBuilder/FormPreview.jsx";
// import EvaluatorForm from "./components/EvaluatorForm/EvaluatorForm.jsx";
// import EvaluatorFormPreview from "./components/EvaluatorForm/EvaluatorFormPreview.jsx";
// import EvaluatorFormDetails from "./components/EvaluatorForm/EvaluatorFormDetails.jsx";
// import EvaluationStartup from "./components/EvaluatorForm/EvaluationStartup.jsx";
// import DisplayEvaluatorForm from "./components/EvaluatorForm/DisplayEvaluatorForm.jsx";
// import EvaluationStartupAllDetail from "./components/EvaluatorForm/EvaluationStartupAllDetail.jsx";
// import EvaluatorDashboard from "./components/EvaluatorForm/EvaluatorDashboard.jsx";
// import SharedFormPreview from "./components/EvaluatorForm/SharedFormPreview.jsx";
// import PublicFormPreview from "./components/Form/PublicFormPreview.jsx";
// import GeneralFormAllResponses from "./components/Form/GeneralFormAllResponses.jsx";
// import Superadmincards from "./components/Cards/Superadmincards.jsx";

// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/email-verified" element={<Emailverified />} />
//         <Route path="/verifydirect" element={<Verifyredirect />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgetpass" element={<Forgetpass />} />
//         <Route path="/forget-pass-mail" element={<Forgetpassmail />} />
//         <Route path="/change-pass" element={<Changepass />} />
//         <Route path="/pass-changed" element={<Passchanged />} />
//         <Route path="/startup-details" element={<Startupdetails />} />
//         <Route path="/Founder" element={<Founder />} />
//         <Route path="/Addnewfounder" element={<Addnewfounder />} />
//         <Route path="/founder-added" element={<Founderadded />} />
//         <Route path="/foundersdata" element={<Foundersdata />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/Cards" element={<Superadmincards />} />

//         <Route path="/form" element={<Form />} />
//         <Route path="/form/:title" element={<FormDetails />} />
//         <Route path="/form-builder" element={<FormBuilder />} />
//         <Route path="/form-preview" element={<FormPreview />} />
//         <Route path="/evaluator-form" element={<EvaluatorForm />} />
//         <Route
//           path="/evaluator-form-preview"
//           element={<EvaluatorFormPreview />}
//         />
//         <Route
//           path="/evaluator-form-details"
//           element={<EvaluatorFormDetails />}
//         />
//         <Route path="/evaluation-startup" element={<EvaluationStartup />} />
//         <Route
//           path="/display-evaluator-form"
//           element={<DisplayEvaluatorForm />}
//         />
//         <Route
//           path="/evaluation-startup/:formTitle"
//           element={<EvaluationStartupAllDetail />}
//         />
//         <Route path="/evaluator-dashboard" element={<EvaluatorDashboard />} />
//         <Route
//           path="/shared-form-preview/:formId"
//           element={<SharedFormPreview />}
//         />
//         <Route
//           path="/public-form-preview/:formId"
//           element={<PublicFormPreview />}
//         />
//         <Route
//           path="/general-form-all-responses/:formId"
//           element={<GeneralFormAllResponses />}
//         />
//         <Route
//           path="/general-form-all-responses/:formId"
//           element={<GeneralFormAllResponses />}
//         />
//         <Route
//           path="/public-form-preview/:formId"
//           element={<PublicFormPreview />}
//         />

//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute roles={["Super Admin"]} />}>
//           <Route path="/superadmindash" element={<SuperadminDash />} />
//         </Route>
//         <Route element={<ProtectedRoute roles={["Admin"]} />}>
//           <Route path="/admindash" element={<Admindashboard />} />
//         </Route>
//         <Route
//           path="/founder-details/:founderId"
//           element={<FounderDetails />}
//         />
//         <Route path="/Misdocs" element={<MisDocs />} />

//         {/* Organization Routes */}
//         <Route path="/organizations" element={<OrganizationList />} />
//         <Route path="/create-organization" element={<CreateOrganization />} />
//         <Route path="/edit-organization/:id" element={<EditOrganization />} />
//         <Route
//           path="/organization-details/:id"
//           element={<OrganizationDetails />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;








//working 8 aug

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Signup from "./components/Signup/Signup.jsx";
// import Emailverified from "./components/Emailverified/Emailverified.jsx";
// import Forgetpass from "./components/Forgetpassmail/Forgetpassmail.jsx";
// import Forgetpassmail from "./components/Forgetpassmail/Forgetpassmail.jsx";
// import Changepass from "./components/Changepass/Changepass.jsx";
// import Passchanged from "./components/Passchanged/Passchanged.jsx";
// import Verifyredirect from "./components/Verifyredirect/Verifyredirect.jsx";
// import Startupdetails from "./components/Startupdetails/Startupdetails.jsx";
// import Founder from "./components/Founders/Founder.jsx";
// import Addnewfounder from "./components/Founders/Addnewfounder/Addnewfounder_1/Addnewfounder.jsx";
// import Founderadded from "./components/Founders/Addnewfounder/Founderadded/Founderadded.jsx";
// import Foundersdata from "./components/Founders/Foundersdata/Foundersdata.jsx";
// import FounderDetails from "./components/Founderdetails/Founderdetails.jsx";
// import MisDocs from "./components/Misdocs/Misdocs.jsx";
// import Dashboard from "./components/Dashboard_1/Dash.jsx";
// import SuperadminDash from "./components/SuperAdmin/Superadmindash.jsx";
// import Admindashboard from "./components/Admin/Admindashboard.jsx"; // Use Admindash
// import Login from "./components/Signin/Login.jsx";
// import ProtectedRoute from "./components/ProtectedRoute";
// import {
//   OrganizationList,
//   CreateOrganization,
//   EditOrganization,
//   OrganizationDetails,
// } from "./components/Organizations/Organizations";
// import Superadmincards from "./components/Cards/Superadmincard/Superadmincards.jsx";
// import Admincards from "./components/Cards/Admincards/Admincard.jsx";

// // PM1
// import Form from "./components/Form/Form.jsx";
// import FormDetails from "./components/Form/FormDetails.jsx";
// import FormBuilder from "./components/FormBuilder/FormBuilder.jsx";
// import FormPreview from "./components/FormBuilder/FormPreview.jsx";
// import EvaluatorForm from "./components/EvaluatorForm/EvaluatorForm.jsx";
// import EvaluatorFormPreview from "./components/EvaluatorForm/EvaluatorFormPreview.jsx";
// import EvaluatorFormDetails from "./components/EvaluatorForm/EvaluatorFormDetails.jsx";
// import EvaluationStartup from "./components/EvaluatorForm/EvaluationStartup.jsx";
// import DisplayEvaluatorForm from "./components/EvaluatorForm/DisplayEvaluatorForm.jsx";
// import EvaluationStartupAllDetail from "./components/EvaluatorForm/EvaluationStartupAllDetail.jsx";
// import EvaluatorDashboard from "./components/EvaluatorForm/EvaluatorDashboard.jsx";
// import SharedFormPreview from "./components/EvaluatorForm/SharedFormPreview.jsx";
// import PublicFormPreview from "./components/Form/PublicFormPreview.jsx";
// import GeneralFormAllResponses from "./components/Form/GeneralFormAllResponses.jsx";

// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/email-verified" element={<Emailverified />} />
//         <Route path="/verifydirect" element={<Verifyredirect />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgetpass" element={<Forgetpass />} />
//         <Route path="/forget-pass-mail" element={<Forgetpassmail />} />
//         <Route path="/change-pass" element={<Changepass />} />
//         <Route path="/pass-changed" element={<Passchanged />} />
//         <Route path="/startup-details" element={<Startupdetails />} />
//         <Route path="/Founder" element={<Founder />} />
//         <Route path="/Addnewfounder" element={<Addnewfounder />} />
//         <Route path="/founder-added" element={<Founderadded />} />
//         <Route path="/foundersdata" element={<Foundersdata />} />
//         <Route path="/Dashboard" element={<Dashboard />} />
//         <Route path="/Cards" element={<Superadmincards />} />

//         <Route path="/form" element={<Form />} />
//         <Route path="/form/:title" element={<FormDetails />} />
//         <Route path="/form-builder" element={<FormBuilder />} />
//         <Route path="/form-preview" element={<FormPreview />} />
//         <Route path="/evaluator-form" element={<EvaluatorForm />} />
//         <Route
//           path="/evaluator-form-preview"
//           element={<EvaluatorFormPreview />}
//         />
//         <Route
//           path="/evaluator-form-details"
//           element={<EvaluatorFormDetails />}
//         />
//         <Route path="/evaluation-startup" element={<EvaluationStartup />} />
//         <Route
//           path="/display-evaluator-form"
//           element={<DisplayEvaluatorForm />}
//         />
//         <Route
//           path="/evaluation-startup/:formTitle"
//           element={<EvaluationStartupAllDetail />}
//         />
//         <Route path="/evaluator-dashboard" element={<EvaluatorDashboard />} />
//         <Route
//           path="/shared-form-preview/:formId"
//           element={<SharedFormPreview />}
//         />
//         <Route
//           path="/public-form-preview/:formId"
//           element={<PublicFormPreview />}
//         />
//         <Route
//           path="/general-form-all-responses/:formId"
//           element={<GeneralFormAllResponses />}
//         />
//         <Route
//           path="/general-form-all-responses/:formId"
//           element={<GeneralFormAllResponses />}
//         />
//         <Route
//           path="/public-form-preview/:formId"
//           element={<PublicFormPreview />}
//         />

//         {/* Protected Routes */}
//         <Route path="/superadmindash" element={<SuperadminDash />} />
//         <Route path="/admindash" element={<Admindashboard />} />
//         <Route path="/admincards" element={<Admincards />} />
//         <Route
//           path="/founder-details/:founderId"
//           element={<FounderDetails />}
//         />
//         <Route path="/Misdocs" element={<MisDocs />} />

//         {/* Organization Routes */}
//         <Route path="/organizations" element={<OrganizationList />} />
//         <Route path="/create-organization" element={<CreateOrganization />} />
//         <Route path="/edit-organization/:id" element={<EditOrganization />} />
//         <Route
//           path="/organization-details/:id"
//           element={<OrganizationDetails />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;










import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup/Signup.jsx";
import Emailverified from "./components/Emailverified/Emailverified.jsx";
import Forgetpass from "./components/Forgetpassmail/Forgetpassmail.jsx";
import Forgetpassmail from "./components/Forgetpassmail/Forgetpassmail.jsx";
import Changepass from "./components/Changepass/Changepass.jsx";
import Passchanged from "./components/Passchanged/Passchanged.jsx";
import Verifyredirect from "./components/Verifyredirect/Verifyredirect.jsx";
import Startupdetails from "./components/Startupdetails/Startupdetails.jsx";
import Founder from "./components/Founders/Founder.jsx";
import Addnewfounder from "./components/Founders/Addnewfounder/Addnewfounder_1/Addnewfounder.jsx";
import Founderadded from "./components/Founders/Addnewfounder/Founderadded/Founderadded.jsx";
import Foundersdata from "./components/Founders/Foundersdata/Foundersdata.jsx";
import FounderDetails from "./components/Founderdetails/Founderdetails.jsx";
import MisDocs from "./components/Misdocs/Misdocs.jsx";
import Dashboard from "./components/Dashboard_1/Dash.jsx";
import SuperadminDash from "./components/SuperAdmin/Superadmindash.jsx";
import Admindashboard from "./components/Admin/Admindashboard.jsx"; // Use Admindash
import Login from "./components/Signin/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  OrganizationList,
  CreateOrganization,
  EditOrganization,
  OrganizationDetails,
} from "./components/Organizations/Organizations";
import Superadmincards from "./components/Cards/Superadmincard/Superadmincards.jsx";
import Admincards from "./components/Cards/Admincards/Admincard.jsx"; // Corrected import path

// PM1
import Form from "./components/Form/Form.jsx";
import FormDetails from "./components/Form/FormDetails.jsx";
import FormBuilder from "./components/FormBuilder/FormBuilder.jsx";
import FormPreview from "./components/FormBuilder/FormPreview.jsx";
import EvaluatorForm from "./components/EvaluatorForm/EvaluatorForm.jsx";
import EvaluatorFormPreview from "./components/EvaluatorForm/EvaluatorFormPreview.jsx";
import EvaluatorFormDetails from "./components/EvaluatorForm/EvaluatorFormDetails.jsx";
import EvaluationStartup from "./components/EvaluatorForm/EvaluationStartup.jsx";
import DisplayEvaluatorForm from "./components/EvaluatorForm/DisplayEvaluatorForm.jsx";
import EvaluationStartupAllDetail from "./components/EvaluatorForm/EvaluationStartupAllDetail.jsx";
import EvaluatorDashboard from "./components/EvaluatorForm/EvaluatorDashboard.jsx";
import SharedFormPreview from "./components/EvaluatorForm/SharedFormPreview.jsx";
import PublicFormPreview from "./components/Form/PublicFormPreview.jsx";
import GeneralFormAllResponses from "./components/Form/GeneralFormAllResponses.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/email-verified" element={<Emailverified />} />
        <Route path="/verifydirect" element={<Verifyredirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpass" element={<Forgetpass />} />
        <Route path="/forget-pass-mail" element={<Forgetpassmail />} />
        <Route path="/change-pass" element={<Changepass />} />
        <Route path="/pass-changed" element={<Passchanged />} />
        <Route path="/startup-details" element={<Startupdetails />} />
        <Route path="/Founder" element={<Founder />} />
        <Route path="/Addnewfounder" element={<Addnewfounder />} />
        <Route path="/founder-added" element={<Founderadded />} />
        <Route path="/foundersdata" element={<Foundersdata />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Cards" element={<Superadmincards />} />
        <Route path="/form" element={<Form />} />
        <Route path="/form/:title" element={<FormDetails />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/form-preview" element={<FormPreview />} />
        <Route path="/evaluator-form" element={<EvaluatorForm />} />
        <Route
          path="/evaluator-form-preview"
          element={<EvaluatorFormPreview />}
        />
        <Route
          path="/evaluator-form-details"
          element={<EvaluatorFormDetails />}
        />
        <Route path="/evaluation-startup" element={<EvaluationStartup />} />
        <Route
          path="/display-evaluator-form"
          element={<DisplayEvaluatorForm />}
        />
        <Route
          path="/evaluation-startup/:formTitle"
          element={<EvaluationStartupAllDetail />}
        />
        <Route path="/evaluator-dashboard" element={<EvaluatorDashboard />} />
        <Route
          path="/shared-form-preview/:formId"
          element={<SharedFormPreview />}
        />
        <Route
          path="/public-form-preview/:formId"
          element={<PublicFormPreview />}
        />
        <Route
          path="/general-form-all-responses/:formId"
          element={<GeneralFormAllResponses />}
        />
        <Route
          path="/general-form-all-responses/:formId"
          element={<GeneralFormAllResponses />}
        />
        <Route
          path="/public-form-preview/:formId"
          element={<PublicFormPreview />}
        />
        {/* Protected Routes */}
        <Route path="/superadmindash" element={<SuperadminDash />} />
        <Route path="/admindash" element={<Admindashboard />} />
        <Route path="/admincards" element={<Admincards />} />{" "}
        {/* Added route */}
        <Route
          path="/founder-details/:founderId"
          element={<FounderDetails />}
        />
        <Route path="/Misdocs" element={<MisDocs />} />
        {/* Organization Routes */}
        <Route path="/organizations" element={<OrganizationList />} />
        <Route path="/create-organization" element={<CreateOrganization />} />
        <Route path="/edit-organization/:id" element={<EditOrganization />} />
        <Route
          path="/organization-details/:id"
          element={<OrganizationDetails />}
        />
      </Routes>
    </Router>
  );
}

export default App;
