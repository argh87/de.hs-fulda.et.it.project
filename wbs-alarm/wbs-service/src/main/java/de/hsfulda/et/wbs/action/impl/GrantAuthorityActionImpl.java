package de.hsfulda.et.wbs.action.impl;

import de.hsfulda.et.wbs.action.GrantAuthorityAction;
import de.hsfulda.et.wbs.core.data.GrantedAuthorityData;
import de.hsfulda.et.wbs.core.exception.AuthorityAlreadyGrantedException;
import de.hsfulda.et.wbs.core.exception.ResourceNotFoundException;
import de.hsfulda.et.wbs.repository.BenutzerRepository;
import de.hsfulda.et.wbs.security.entity.GrantedAuthority;
import de.hsfulda.et.wbs.security.repository.AuthorityRepository;
import de.hsfulda.et.wbs.security.repository.GrantedAuthorityRepository;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Component
public class GrantAuthorityActionImpl implements GrantAuthorityAction {

    private final GrantedAuthorityRepository repo;
    private final AuthorityRepository authorityRepository;
    private final BenutzerRepository benutzerRepository;

    public GrantAuthorityActionImpl(GrantedAuthorityRepository repo, AuthorityRepository authorityRepository,
            BenutzerRepository benutzerRepository) {
        this.repo = repo;
        this.authorityRepository = authorityRepository;
        this.benutzerRepository = benutzerRepository;
    }

    @Override
    public void perform(Long authorityId, Long benutzerId) {
        if (!(benutzerRepository.existsById(benutzerId) && authorityRepository.existsById(authorityId))) {
            throw new ResourceNotFoundException("Authority mit ID a:{0}, b:{1} nicht gefunden.", authorityId,
                    benutzerId);
        }

        List<GrantedAuthorityData> granted = repo.findByUserId(benutzerId);
        boolean alreadyGranted = granted.stream()
                .anyMatch(g -> authorityId.equals(g.getAuthorityId()));
        if (alreadyGranted) {
            throw new AuthorityAlreadyGrantedException(
                    "Das Recht wurde bereits vergeben und kann nicht erneut vergeben werden.");
        }

        GrantedAuthority toGrant = new GrantedAuthority();
        toGrant.setAuthorityId(authorityId);
        toGrant.setUserId(benutzerId);
        repo.save(toGrant);
    }
}
