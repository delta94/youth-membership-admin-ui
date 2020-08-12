import React, { useState } from 'react';
import {
  FormWithRedirect,
  SaveButton,
  Toolbar,
  useTranslate,
} from 'react-admin';
import { useFormState } from 'react-final-form';
import { useHistory, useParams } from 'react-router';
import countries from 'i18n-iso-countries';
import { FieldArray } from 'react-final-form-arrays';

import styles from './YouthProfileForm.module.css';
import { Language } from '../../../graphql/generatedTypes';
import TextInput from './inputs/TextInput';
import RadioGroupInput from './inputs/RadioGroupInput';
import BirthDateInput from './inputs/BirthDateInput';
import SelectInput from './inputs/SelectInput';
import { FormValues } from '../types/youthProfileTypes';
import youthFormValidator, {
  ValidationErrors,
} from '../helpers/youthFormValidator';

type Props = {
  record?: FormValues;
  method?: string;
  save: (values: FormValues) => void;
  saving: boolean;
  profileID?: string;
};

type Params = {
  id?: string;
  method?: string;
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
const YouthProfileForm = (props: Props) => {
  const [errors, setErrors] = useState<ValidationErrors>(
    {} as ValidationErrors
  );
  const t = useTranslate();
  const history = useHistory();
  const params: Params = useParams();

  const onSave = (values: FormValues) => {
    const nextErrors: ValidationErrors = youthFormValidator(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      props.save(values);
    }
  };

  // This component is used to access form data so it can be passed to validator
  const CustomButton = () => {
    const form = useFormState();

    return (
      <SaveButton
        label={
          props.method === 'renew'
            ? 'youthProfiles.renew'
            : 'youthProfiles.save'
        }
        handleSubmitWithRedirect={() => onSave(form.values as FormValues)}
      />
    );
  };

  const CancelButton = () => {
    const path =
      params.method === 'update' || params.method === 'renew'
        ? `/youthProfiles/${props.profileID}/show/${history.location.search}`
        : `/youthProfiles${history.location.search}`;
    return (
      <button
        className={styles.cancelButton}
        onClick={() => history.push(path)}
      >
        {t('youthProfiles.cancel')}
      </button>
    );
  };

  // TODO if possible change getNames list based on current language
  // TODO at the moment language will always default to finnish & there isn't option to change it manually
  const countryList = countries.getNames('fi');
  const countryOptions = Object.keys(countryList).map((key) => {
    return {
      value: key,
      label: countryList[key] as string,
    };
  });

  return (
    <FormWithRedirect
      basePath="/youthProfiles"
      resource="youthProfiles"
      initialValues={{
        languageAtHome: 'FINNISH',
        profileLanguage: 'FINNISH',
        photoUsageApproved: 'false',
        primaryAddress: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: 'FI',
          primary: true,
        },
        addresses: [],
      }}
      record={props.record}
      render={() => (
        <form>
          <div className={styles.wrapper}>
            <p className={styles.title}>{t('youthProfiles.basicInfo')}</p>
            <div className={styles.rowContainer}>
              <TextInput
                name="firstName"
                label={t('youthProfiles.firstName')}
                className={styles.textField}
                error={errors.firstName}
              />
              <TextInput
                label={t('youthProfiles.lastName')}
                name="lastName"
                className={styles.textField}
                error={errors.lastName}
              />
            </div>
            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.streetAddress')}
                name="primaryAddress.address"
                className={styles.textField}
                error={errors.primaryAddress?.address}
              />

              <TextInput
                label={t('youthProfiles.city')}
                name="primaryAddress.city"
                className={styles.textField}
                error={errors.primaryAddress?.city}
              />
            </div>
            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.postalCode')}
                name="primaryAddress.postalCode"
                className={styles.textField}
                error={errors.primaryAddress?.postalCode}
              />

              <SelectInput
                name="primaryAddress.countryCode"
                labelText={t('youthProfiles.country')}
                options={countryOptions}
                className={styles.select}
              />
            </div>

            <FieldArray name="addresses">
              {({ fields }) => (
                <React.Fragment>
                  {fields.map((name, index) => (
                    <div key={index}>
                      <div className={styles.rowContainer}>
                        <TextInput
                          name={`${name}.address`}
                          label={t('youthProfiles.streetAddress')}
                          className={styles.textField}
                          error={errors.addresses?.[index]?.address}
                        />
                        <TextInput
                          name={`${name}.city`}
                          label={t('youthProfiles.city')}
                          className={styles.textField}
                          error={errors.addresses?.[index]?.city}
                        />
                      </div>

                      <div className={styles.rowContainer}>
                        <TextInput
                          name={`${name}.postalCode`}
                          label={t('youthProfiles.postalCode')}
                          className={styles.textField}
                          error={errors.addresses?.[index]?.postalCode}
                        />
                        <SelectInput
                          name={`${name}.countryCode`}
                          labelText={t('youthProfiles.country')}
                          options={countryOptions}
                          className={styles.select}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fields.remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      fields.push({
                        address: '',
                        postalCode: '',
                        city: '',
                        countryCode: 'FI',
                        primary: false,
                      })
                    }
                  >
                    Add another address
                  </button>
                </React.Fragment>
              )}
            </FieldArray>

            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.email')}
                name="email"
                className={styles.textField}
                error={errors.email}
              />

              <TextInput
                label={t('youthProfiles.phone')}
                name="phone"
                className={styles.textField}
                error={errors.phone}
              />
            </div>

            <div className={styles.rowContainer}>
              <BirthDateInput
                inputName="birthDate"
                label={t('youthProfiles.birthDate')}
                error={errors.birthDate}
              />

              <SelectInput
                name="profileLanguage"
                labelText={t('youthProfiles.profileLanguage')}
                options={[
                  {
                    value: Language.FINNISH,
                    label: t('LANGUAGE_OPTIONS.FINNISH'),
                  },
                  {
                    value: Language.ENGLISH,
                    label: t('LANGUAGE_OPTIONS.ENGLISH'),
                  },
                  {
                    value: Language.SWEDISH,
                    label: t('LANGUAGE_OPTIONS.SWEDISH'),
                  },
                ]}
                className={styles.select}
              />
            </div>
          </div>

          <div className={styles.infoContainer}>
            <p className={styles.title}>{t('youthProfiles.extraInfo')}</p>
            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.schoolName')}
                name="schoolName"
                className={styles.textField}
                error={errors.schoolName}
              />

              <TextInput
                label={t('youthProfiles.schoolClass')}
                name="schoolClass"
                className={styles.textField}
                error={errors.schoolClass}
              />
            </div>

            <RadioGroupInput
              initialValue={props?.record?.languageAtHome || Language.FINNISH}
              label={t('youthProfiles.languageAtHome')}
              name="languageAtHome"
              choices={[
                { id: Language.FINNISH, name: t('LANGUAGE_OPTIONS.FINNISH') },
                { id: Language.ENGLISH, name: t('LANGUAGE_OPTIONS.ENGLISH') },
                { id: Language.SWEDISH, name: t('LANGUAGE_OPTIONS.SWEDISH') },
              ]}
            />
            <RadioGroupInput
              initialValue={props?.record?.photoUsageApproved || 'false'}
              name="photoUsageApproved"
              label={t('youthProfiles.photoUsage')}
              choices={[
                { id: 'true', name: t('youthProfiles.photoApprovedTrue') },
                { id: 'false', name: t('youthProfiles.photoApprovedFalse') },
              ]}
            />
          </div>

          <div className={styles.infoContainer}>
            <p className={styles.title}>{t('youthProfiles.approverInfo')}</p>
            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.firstName')}
                name="approverFirstName"
                className={styles.textField}
                error={errors.approverFirstName}
              />

              <TextInput
                label={t('youthProfiles.lastName')}
                name="approverLastName"
                className={styles.textField}
                error={errors.approverLastName}
              />
            </div>
            <div className={styles.rowContainer}>
              <TextInput
                label={t('youthProfiles.email')}
                name="approverEmail"
                className={styles.textField}
                error={errors.approverEmail}
              />

              <TextInput
                label={t('youthProfiles.phone')}
                name="approverPhone"
                className={styles.textField}
                error={errors.approverPhone}
              />
            </div>
            <Toolbar>
              <CustomButton />
              <CancelButton />
            </Toolbar>
          </div>
        </form>
      )}
    />
  );
};

export default YouthProfileForm;
