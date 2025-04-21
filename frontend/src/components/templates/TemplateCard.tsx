import React from 'react';
import { Link } from 'react-router-dom';
import { PromptTemplate } from '../../types/models';
import { Card, Badge } from '../ui';

interface TemplateCardProps {
  template: PromptTemplate;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  // Function to get a preview of the template content
  const getTemplatePreview = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };
  
  // Function to extract variables from the template
  const extractVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const matches = content.match(regex) || [];
    return matches.map(match => match.replace(/{{|}}/g, '').trim());
  };
  
  const variables = extractVariables(template.template);
  
  return (
    <Card
      className="h-full flex flex-col transition-shadow hover:shadow-lg"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
          <Badge variant="primary" size="sm">{template.model}</Badge>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 font-mono">
          {getTemplatePreview(template.template)}
        </p>
        
        {variables.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Variables:</h4>
            <div className="flex flex-wrap gap-1">
              {variables.map((variable, index) => (
                <Badge key={index} variant="gray" size="sm">
                  {variable}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={`/templates/${template.id}`}
          className="text-primary-600 hover:text-primary-800 text-sm font-medium"
        >
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
};

export default TemplateCard;
